import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap pointer-coarse:min-h-11";

const variants: Record<Variant, string> = {
  primary:
    "bg-trace text-on-accent hover:bg-trace-hot hover:shadow-[0_0_24px_4px_color-mix(in_srgb,var(--trace)_30%,transparent)]",
  ghost:
    "border border-line text-fg hover:border-trace/40 hover:text-trace-hot",
};

const sizes = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
};

type ButtonLinkProps = {
  variant?: Variant;
  size?: keyof typeof sizes;
  children: ReactNode;
} & ComponentProps<typeof Link>;

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  size?: keyof typeof sizes;
  children: ReactNode;
} & ComponentProps<"button">;

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
