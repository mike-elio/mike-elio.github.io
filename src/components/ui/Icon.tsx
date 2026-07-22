import type { ReactNode } from "react";

export type IconName = "brain" | "code" | "server" | "tools";

const paths: Record<IconName, ReactNode> = {
  brain: (
    <>
      <path d="M9.5 4.5A3 3 0 0 0 6.6 8a3.5 3.5 0 0 0 .8 6.7A3 3 0 0 0 12 17V7.5a3 3 0 0 0-2.5-3Z" />
      <path d="M14.5 4.5A3 3 0 0 1 17.4 8a3.5 3.5 0 0 1-.8 6.7A3 3 0 0 1 12 17" />
      <path d="M8 10h2M14 10h2M9 14h3M12 7h3" />
    </>
  ),
  code: (
    <>
      <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="5" width="16" height="5" rx="1" />
      <rect x="4" y="14" width="16" height="5" rx="1" />
      <path d="M8 7.5h.01M8 16.5h.01M12 7.5h4M12 16.5h4" />
    </>
  ),
  tools: (
    <>
      <path d="M14 6a4 4 0 0 0-5 5L4.5 15.5a2.1 2.1 0 0 0 3 3L12 14a4 4 0 0 0 5-5l-2.5 2.5-2-2Z" />
    </>
  ),
};

export function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
    >
      {paths[name]}
    </svg>
  );
}
