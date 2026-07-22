import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  hasMinimumFillTime,
  validateContact,
  type ContactField,
  type ContactFieldErrors,
  type ContactValues,
} from "./contactSchema";
import {
  submitContact,
  type SubmitContactArgs,
  type SubmitContactResult,
} from "./submitContact";
import { TurnstileWidget } from "./TurnstileWidget";

type FormState =
  | "idle"
  | "validating"
  | "challenge-required"
  | "submitting"
  | "success"
  | "validation-error"
  | "rate-limited"
  | "network-error";

type PublicContactConfig = { formId: string; siteKey: string };
type Submitter = (args: SubmitContactArgs) => ReturnType<typeof submitContact>;

const emptyValues: ContactValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const statusMessages: Partial<Record<FormState, string>> = {
  success: "Thanks — your message was sent successfully.",
  "challenge-required": "Please complete human verification before sending.",
  "validation-error": "Check the highlighted fields and try again.",
  "rate-limited": "Too many attempts were received. Please wait before trying again.",
  "network-error":
    "Your message could not be sent. Your text is preserved; please retry or use LinkedIn.",
};

export function ContactForm({
  config = {
    formId: import.meta.env.VITE_FORMSPREE_FORM_ID,
    siteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  },
  submitter = submitContact,
  now = Date.now,
}: {
  config?: PublicContactConfig;
  submitter?: Submitter;
  now?: () => number;
}) {
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [honeypot, setHoneypot] = useState("");
  const [token, setToken] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [challengeUnavailable, setChallengeUnavailable] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const [coolingDown, setCoolingDown] = useState(false);
  const [requestInFlight, setRequestInFlight] = useState(false);
  const [statusOverride, setStatusOverride] = useState<string | null>(null);
  const startedAt = useRef(now());
  const statusRef = useRef<HTMLParagraphElement>(null);
  const cooldownTimer = useRef<number | null>(null);
  const mounted = useRef(true);
  const requestGeneration = useRef(0);
  const inFlight = useRef(false);

  const focusStatus = useCallback(() => {
    queueMicrotask(() => statusRef.current?.focus());
  }, []);
  const updateToken = useCallback((nextToken: string) => {
    if (!mounted.current) return;
    setToken(nextToken);
    if (nextToken) setChallengeUnavailable(false);
  }, []);
  const markChallengeUnavailable = useCallback(() => {
    if (!mounted.current) return;
    setChallengeUnavailable(true);
    setStatusOverride(
      "Human verification could not load. Retry the page or contact me on LinkedIn.",
    );
    if (!inFlight.current) {
      setState("challenge-required");
      focusStatus();
    }
  }, [focusStatus]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestGeneration.current += 1;
      if (cooldownTimer.current !== null) {
        window.clearTimeout(cooldownTimer.current);
      }
    };
  }, []);

  const beginCooldown = (durationMs: number) => {
    if (!mounted.current) return;
    setCoolingDown(true);
    if (cooldownTimer.current !== null) {
      window.clearTimeout(cooldownTimer.current);
    }
    cooldownTimer.current = window.setTimeout(() => {
      if (mounted.current) setCoolingDown(false);
    }, durationMs);
  };

  const updateField = (field: ContactField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current || state === "submitting" || coolingDown) return;
    setStatusOverride(null);
    setState("validating");
    const validation = validateContact(values);
    if (!validation.success) {
      setErrors(validation.errors);
      setState("validation-error");
      const first = (["name", "email", "subject", "message"] as const).find(
        (field) => validation.errors[field],
      );
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }
    if (!hasMinimumFillTime(startedAt.current, now())) {
      setErrors({});
      setStatusOverride("Please wait a moment before sending.");
      setState("validation-error");
      focusStatus();
      return;
    }
    if (!token || challengeUnavailable) {
      setState("challenge-required");
      focusStatus();
      return;
    }

    inFlight.current = true;
    const currentRequest = requestGeneration.current + 1;
    requestGeneration.current = currentRequest;
    setRequestInFlight(true);
    setState("submitting");
    let result: SubmitContactResult;
    try {
      result = await submitter({
        values: validation.data,
        turnstileToken: token,
        honeypot,
        config: { formId: config.formId },
      });
    } catch {
      result = { ok: false, kind: "network-error" };
    }
    inFlight.current = false;
    if (!mounted.current || requestGeneration.current !== currentRequest) return;
    setRequestInFlight(false);
    setStatusOverride(null);
    if (result.ok) {
      setValues(emptyValues);
      setHoneypot("");
      setToken("");
      setErrors({});
      setResetSignal((value) => value + 1);
      beginCooldown(10_000);
      startedAt.current = now();
      setState("success");
      focusStatus();
      return;
    }
    setToken("");
    setResetSignal((value) => value + 1);
    if (result.kind === "rate-limited") {
      beginCooldown(30_000);
      setState("rate-limited");
    } else {
      setState("network-error");
    }
    focusStatus();
  };

  const submitLabel =
    requestInFlight
      ? "Sending…"
      : state === "network-error"
        ? "Retry message"
        : state === "success" && coolingDown
          ? "Message sent"
          : state === "rate-limited" && coolingDown
            ? "Please wait"
            : "Send message";

  return (
    <form className="contact-form" noValidate onSubmit={handleSubmit}>
      {(["name", "email", "subject", "message"] as const).map((field) => {
        const label = field[0].toUpperCase() + field.slice(1);
        const isMessage = field === "message";
        const common = {
          "aria-describedby": errors[field]
            ? `contact-${field}-error`
            : undefined,
          "aria-invalid": errors[field] ? (true as const) : undefined,
          id: `contact-${field}`,
          maxLength:
            field === "name"
              ? 80
              : field === "email"
                ? 254
                : field === "subject"
                  ? 120
                  : 2000,
          name: field,
          onChange: (
            event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => updateField(field, event.target.value),
          required: true,
          value: values[field],
        };
        return (
          <div
            className={isMessage ? "form-field form-field--wide" : "form-field"}
            key={field}
          >
            <label htmlFor={`contact-${field}`}>{label}</label>
            {isMessage ? (
              <textarea {...common} minLength={20} rows={6} />
            ) : (
              <input
                {...common}
                autoComplete={
                  field === "name" ? "name" : field === "email" ? "email" : "off"
                }
                minLength={
                  field === "name" ? 2 : field === "subject" ? 3 : undefined
                }
                type={field === "email" ? "email" : "text"}
              />
            )}
            {errors[field] ? (
              <p id={`contact-${field}-error`}>{errors[field]}</p>
            ) : null}
          </div>
        );
      })}

      <div aria-hidden="true" className="contact-honeypot">
        <label htmlFor="contact-company">Company website</label>
        <input
          autoComplete="off"
          id="contact-company"
          name="_gotcha"
          onChange={(event) => setHoneypot(event.target.value)}
          tabIndex={-1}
          value={honeypot}
        />
      </div>

      <TurnstileWidget
        onToken={updateToken}
        onUnavailable={markChallengeUnavailable}
        resetSignal={resetSignal}
        siteKey={config.siteKey}
      />

      <p
        aria-live={state === "success" ? "polite" : "assertive"}
        className="form-status"
        ref={statusRef}
        tabIndex={-1}
      >
        {statusOverride ?? statusMessages[state] ?? ""}
      </p>
      <button
        disabled={requestInFlight || coolingDown || challengeUnavailable}
        type="submit"
      >
        {submitLabel}
      </button>
    </form>
  );
}
