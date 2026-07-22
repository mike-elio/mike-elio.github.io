import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useFocusTrap } from "../../components/navigation/useFocusTrap";
import { TagList } from "../../components/ui/TagList";
import type { Education } from "../../data/portfolio";

export function EducationDialog({
  entry,
  onClose,
  returnFocusRef,
}: {
  entry: Education | null;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const close = useCallback(() => onClose(), [onClose]);
  const supportsNativeModal =
    typeof HTMLDialogElement !== "undefined" &&
    typeof HTMLDialogElement.prototype.showModal === "function";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const cancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    dialog.addEventListener("cancel", cancel);

    if (entry) {
      document.body.classList.add("dialog-open");
      if (supportsNativeModal) {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
    } else if (dialog.open) {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    }

    return () => {
      dialog.removeEventListener("cancel", cancel);
      document.body.classList.remove("dialog-open");
    };
  }, [close, entry, supportsNativeModal]);

  useFocusTrap({
    active: entry !== null,
    containerRef: dialogRef,
    returnFocusRef,
    onEscape: close,
  });

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-redundant-roles
    <dialog
      aria-describedby={entry?.summary ? "education-dialog-description" : undefined}
      aria-labelledby={entry ? "education-dialog-title" : undefined}
      aria-modal={entry ? "true" : undefined}
      className={
        supportsNativeModal
          ? "project-dialog education-dialog"
          : "project-dialog project-dialog--fallback education-dialog"
      }
      data-dialog-mode={supportsNativeModal ? "native" : "fallback"}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      ref={dialogRef}
      role="dialog"
    >
      {entry ? (
        <div className="project-dialog-panel education-dialog-panel">
          <button aria-label="Close education details" onClick={close} type="button">
            Close
          </button>
          <p className="project-eyebrow">{entry.type}</p>
          <h2 id="education-dialog-title">{entry.title}</h2>
          <p className="education-dialog-meta">
            <strong>{entry.organization}</strong>
            <span>{entry.date}</span>
            {entry.grade ? <span>{entry.grade}</span> : null}
          </p>
          {entry.summary ? (
            <p id="education-dialog-description">{entry.summary}</p>
          ) : null}
          {entry.activities ? (
            <section aria-labelledby="education-activities-title">
              <h3 id="education-activities-title">Activities &amp; societies</h3>
              <p>{entry.activities}</p>
            </section>
          ) : null}
          {entry.projects?.length ? (
            <section aria-labelledby="education-projects-title">
              <h3 id="education-projects-title">Academic projects</h3>
              <ul className="education-projects">
                {entry.projects.map((project) => <li key={project}>{project}</li>)}
              </ul>
            </section>
          ) : null}
          {entry.details ? (
            <section aria-labelledby="education-experience-title">
              <h3 id="education-experience-title">Practical experience</h3>
              <p>{entry.details}</p>
            </section>
          ) : null}
          {entry.skills?.length ? (
            <section aria-labelledby="education-skills-title">
              <h3 id="education-skills-title">Skills</h3>
              <TagList label={`${entry.title} skills`} items={entry.skills} />
            </section>
          ) : null}
        </div>
      ) : null}
    </dialog>
  );
}
