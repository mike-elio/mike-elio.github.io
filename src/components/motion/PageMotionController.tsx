import { useEffect } from "react";
import { useMotionBudget } from "./useMotionBudget";

export function PageMotionController() {
  const reduced = useMotionBudget();

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [reduced]);

  useEffect(() => {
    const update = () => {
      document.documentElement.dataset.pageVisibility =
        document.visibilityState === "hidden" ? "hidden" : "visible";
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      delete document.documentElement.dataset.pageVisibility;
    };
  }, []);

  return null;
}
