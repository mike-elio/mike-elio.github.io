import { useEffect, useRef, useState } from "react";

interface TypewriterOptions {
  reduced?: boolean;
  typeMs?: number;
  holdMs?: number;
  eraseMs?: number;
}

type Phase = "typing" | "holding" | "erasing";

export function useTypewriter(
  phrases: readonly string[],
  {
    reduced = false,
    typeMs = 55,
    holdMs = 1500,
    eraseMs = 30,
  }: TypewriterOptions = {},
): string {
  const phraseIndex = useRef(0);
  const characterCount = useRef(0);
  const phase = useRef<Phase>("typing");
  const phrasesRef = useRef(phrases);
  const [text, setText] = useState("");
  const [pageVisible, setPageVisible] = useState(
    document.visibilityState !== "hidden",
  );

  useEffect(() => {
    phrasesRef.current = phrases;
  }, [phrases]);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (reduced || !pageVisible || phrases.length === 0) return;

    let timer = 0;

    const scheduleNextTick = () => {
      const delay =
        phase.current === "typing"
          ? typeMs
          : phase.current === "holding"
            ? holdMs
            : eraseMs;
      timer = window.setTimeout(tick, delay);
    };

    const tick = () => {
      const currentPhrase = phrasesRef.current[phraseIndex.current] ?? "";

      if (phase.current === "typing") {
        if (characterCount.current < currentPhrase.length) {
          characterCount.current += 1;
          setText(currentPhrase.slice(0, characterCount.current));
        } else {
          phase.current = "holding";
        }
      } else if (phase.current === "holding") {
        phase.current = "erasing";
      } else if (characterCount.current > 0) {
        characterCount.current -= 1;
        setText(currentPhrase.slice(0, characterCount.current));
      } else {
        phraseIndex.current =
          (phraseIndex.current + 1) % phrasesRef.current.length;
        phase.current = "typing";
      }

      scheduleNextTick();
    };

    scheduleNextTick();

    return () => window.clearTimeout(timer);
  }, [
    eraseMs,
    holdMs,
    pageVisible,
    phrases.length,
    reduced,
    typeMs,
  ]);

  return reduced ? (phrases[0] ?? "") : text;
}
