import { useEffect, useState } from "react";

export function useActiveSection(ids: readonly string[]): string {
  const [activeId, setActiveId] = useState(ids[0] ?? "");

  useEffect(() => {
    if (typeof window.IntersectionObserver !== "function") return;

    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(
            entry.target,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });
        const visible = [...ratios.entries()]
          .filter(([, ratio]) => ratio > 0)
          .sort(([, left], [, right]) => right - left)[0];
        if (visible?.[0] instanceof HTMLElement) {
          setActiveId(visible[0].id);
        }
      },
      { rootMargin: "-24% 0px -64%", threshold: [0.05, 0.25, 0.55] },
    );

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        ratios.set(section, 0);
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
