import type { PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "../../lib/cn";
import { useMotionBudget } from "../motion/useMotionBudget";

export function Reveal({
  children,
  className,
  delay = 0,
}: PropsWithChildren<{ className?: string; delay?: 0 | 1 | 2 | 3 }>) {
  const reduced = useMotionBudget();
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(
    reduced || typeof window.IntersectionObserver !== "function",
  );

  useEffect(() => {
    if (
      revealed ||
      reduced ||
      typeof window.IntersectionObserver !== "function"
    ) {
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setRevealed(true);
        observer.unobserve(element);
      },
      { rootMargin: "0px 0px -8%", threshold: 0.12 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced, revealed]);

  return (
    <div
      className={cn("reveal", `reveal--delay-${delay}`, className)}
      data-revealed={revealed || reduced}
      ref={ref}
    >
      {children}
    </div>
  );
}
