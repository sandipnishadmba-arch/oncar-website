import Link from "next/link";
import { cn, formatWhatsAppLink } from "@/lib/utils";
import type { ButtonVariant, ButtonSize } from "@/types";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  whatsappMessage?: string;
  className?: string;
  onClick?: (e?: any) => void;
  type?: "button" | "submit";
  ariaLabel?: string;
  disabled?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-50 disabled:pointer-events-none",
  secondary:
    "bg-secondary text-primary hover:bg-secondary/90 shadow-lg shadow-secondary/20 disabled:opacity-50 disabled:pointer-events-none",
  outline:
    "border-2 border-primary/20 text-primary bg-white hover:border-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:pointer-events-none",
  whatsapp:
    "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-[#25D366]/25 disabled:opacity-50 disabled:pointer-events-none",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-base font-semibold",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  whatsappMessage,
  className,
  onClick,
  type = "button",
  ariaLabel,
  disabled,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 active:scale-[0.98]";

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  if ((variant === "whatsapp" || whatsappMessage) && !href && !onClick && type !== "submit") {
    const message =
      whatsappMessage ??
      "Hi! I'd like to get a free quote for home improvement services in Surat.";
    return (
      <a
        href={formatWhatsAppLink(message)}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        aria-label={ariaLabel ?? "Contact us on WhatsApp"}
      >
        {children}
      </a>
    );
  }

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClassName}
          aria-label={ariaLabel}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClassName} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
