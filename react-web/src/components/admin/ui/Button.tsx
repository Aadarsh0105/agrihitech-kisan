import React from "react";
import { cn } from "../../../utils/admin/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outlineDanger" | "subtle";
type ButtonSize = "sm" | "md" | "lg" | "icon" | "iconSm";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "bg-surface text-foreground border border-border hover:bg-muted",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  danger: "bg-danger text-danger-foreground hover:bg-danger/90",
  outlineDanger: "border border-danger/40 text-danger hover:bg-danger-subtle",
  subtle: "bg-muted text-foreground hover:bg-accent"
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-3.5 text-sm",
  lg: "h-10 px-5 text-sm",
  icon: "h-9 w-9",
  iconSm: "h-8 w-8"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
