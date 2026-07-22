import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "../../data/portfolio";
import { useActiveSection } from "./useActiveSection";
import { useFocusTrap } from "./useFocusTrap";

const navigation = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;

const sectionIds = navigation.map((item) => item.id);

function NavigationLinks({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect?: () => void;
}) {
  return navigation.map((item) => (
    <a
      aria-current={activeId === item.id ? "location" : undefined}
      href={`#${item.id}`}
      key={item.id}
      onClick={onSelect}
    >
      {item.label}
    </a>
  ));
}

export function Header() {
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection(sectionIds);
  const brandRef = useRef<HTMLAnchorElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const desktopFocusPendingRef = useRef(false);
  const panelRef = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useFocusTrap({
    active: open,
    containerRef: panelRef,
    returnFocusRef: buttonRef,
    onEscape: close,
  });

  useEffect(() => {
    document.body.classList.toggle("navigation-open", open);
    return () => document.body.classList.remove("navigation-open");
  }, [open]);

  useEffect(() => {
    if (open || !desktopFocusPendingRef.current) return;
    desktopFocusPendingRef.current = false;
    brandRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const desktopQuery = window.matchMedia?.("(min-width: 900px)");
    if (!desktopQuery) return;

    const handleDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      setOpen((current) => {
        if (!current) return current;
        desktopFocusPendingRef.current = true;
        return false;
      });
    };
    desktopQuery.addEventListener("change", handleDesktop);
    return () => desktopQuery.removeEventListener("change", handleDesktop);
  }, []);

  return (
    <header className="site-header" data-testid="site-header">
      <a aria-label={`${profile.name}, home`} className="brand" href="#top" ref={brandRef}>
        ME<span aria-hidden="true">.</span>
      </a>

      <nav aria-label="Primary navigation" className="desktop-navigation">
        <NavigationLinks activeId={activeId} />
      </nav>

      <a className="header-contact" href="#contact">
        Let's Talk
      </a>

      <button
        aria-controls="mobile-navigation"
        aria-expanded={open}
        aria-label={open ? "Close navigation" : "Open navigation"}
        className="menu-trigger"
        onClick={() => setOpen((current) => !current)}
        ref={buttonRef}
        type="button"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <button
        aria-label="Close navigation"
        className="navigation-backdrop"
        hidden={!open}
        onClick={close}
        tabIndex={-1}
        type="button"
      />
      <aside
        aria-label="Site navigation"
        aria-modal="true"
        className="mobile-navigation"
        hidden={!open}
        id="mobile-navigation"
        ref={panelRef}
        role="dialog"
      >
        <button aria-label="Close navigation" onClick={close} type="button">
          Close
        </button>
        <nav aria-label="Mobile navigation">
          <NavigationLinks activeId={activeId} onSelect={close} />
        </nav>
      </aside>
    </header>
  );
}
