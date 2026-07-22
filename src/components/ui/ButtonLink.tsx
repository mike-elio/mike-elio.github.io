import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "../../lib/cn";

type ButtonLinkProps = PropsWithChildren<
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: "primary" | "secondary";
    external?: boolean;
  }
>;

export function ButtonLink({
  children,
  className,
  external = false,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <a
      {...props}
      className={cn("button-link", `button-link--${variant}`, className)}
      rel={external ? "noopener noreferrer" : props.rel}
      target={external ? "_blank" : props.target}
    >
      {children}
    </a>
  );
}
