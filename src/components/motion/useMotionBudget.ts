import { useEffect, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean };
};

function shouldReduceMotion(): boolean {
  const prefersReduced = window.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const savesData = (navigator as NavigatorWithConnection).connection?.saveData;
  return Boolean(prefersReduced || savesData);
}

export function useMotionBudget(): boolean {
  const [reduced, setReduced] = useState(shouldReduceMotion);

  useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return;
    const update = () => setReduced(shouldReduceMotion());
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
