import type { RefObject } from "react";
import { useCallback, useEffect, useRef } from "react";
import { useFocusTrap } from "../../components/navigation/useFocusTrap";
import { TagList } from "../../components/ui/TagList";
import type { Project } from "../../data/portfolio";

export function ProjectDialog({
  project,
  onClose,
  returnFocusRef,
}: {
  project: Project | null;
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

    if (project) {
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
  }, [close, project, supportsNativeModal]);

  // Open the native or fallback dialog before the trap moves initial focus.
  // Browsers ignore focus calls into a closed <dialog>, even in fallback mode.
  useFocusTrap({
    active: project !== null,
    containerRef: dialogRef,
    returnFocusRef,
    onEscape: close,
  });

  return (
    // The explicit role preserves semantics in fallback browsers without native
    // HTMLDialogElement support; keyboard dismissal remains in the focus trap.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-redundant-roles
    <dialog
      aria-describedby={project ? "project-dialog-description" : undefined}
      aria-labelledby={project ? "project-dialog-title" : undefined}
      aria-modal={project ? "true" : undefined}
      className={
        supportsNativeModal
          ? "project-dialog"
          : "project-dialog project-dialog--fallback"
      }
      data-dialog-mode={supportsNativeModal ? "native" : "fallback"}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      ref={dialogRef}
      role="dialog"
    >
      {project ? (
        <div className="project-dialog-panel">
          <button aria-label="Close project details" onClick={close} type="button">
            Close
          </button>
          <p className="project-eyebrow">{project.eyebrow}</p>
          <h2 id="project-dialog-title">{project.title}</h2>
          <p id="project-dialog-description">{project.description}</p>
          <section aria-labelledby="project-contribution-title">
            <h3 id="project-contribution-title">My contribution</h3>
            <p>{project.contribution}</p>
          </section>
          <section aria-labelledby="project-features-title">
            <h3 id="project-features-title">Key features</h3>
            <ul>
              {project.features.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
          </section>
          <TagList label={`${project.title} full technology stack`} items={project.technologies} />
          {project.visibility === "public" ? (
            <a href={project.sourceUrl} rel="noopener noreferrer" target="_blank">
              View source code<span aria-hidden="true"> ↗</span>
            </a>
          ) : (
            <p className="private-project-note">
              Collaborative academic case study; source code is not published.
            </p>
          )}
        </div>
      ) : null}
    </dialog>
  );
}
