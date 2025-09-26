import React, { ReactElement } from "react";
import "./Button.scss";

export interface ButtonProps {
  variant?:
    | "primary"
    | "secondary"
    | "gray"
    | "ghost"
    | "destructive"
    | "warning";
  type?: "text" | "icon-only";
  size?: "sm" | "md";
  leadingIcon?: ReactElement;
  trailingIcon?: ReactElement;
  children?: string | number;
  disabled?: boolean;
  "aria-label"?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  type = "text",
  size = "md",
  leadingIcon,
  trailingIcon,
  children,
  disabled = false,
  "aria-label": ariaLabel,
  ...props
}) => {
  const baseClass = "btn";
  const variantClass = `btn--${variant}`;
  const typeClass = `btn--${type}`;
  const sizeClass = `btn--${size}`;
  const disabledClass = disabled ? "btn--disabled" : "";

  const buttonClasses = [
    baseClass,
    variantClass,
    typeClass,
    sizeClass,
    disabledClass,
  ]
    .filter(Boolean)
    .join(" ");

  if (type === "icon-only" && !ariaLabel) {
    console.warn(
      "Icon-only buttons should have an aria-label for accessibility"
    );
  }

  if (type === "icon-only" && children) {
    console.warn("Icon-only buttons should not have button text");
  }

  return (
    <button className={buttonClasses} disabled={disabled} {...props}>
      {leadingIcon && (
        <span className="btn__icon btn__icon--leading">{leadingIcon}</span>
      )}
      {type === "text" && children && (
        <span className="btn__text">{children}</span>
      )}
      {type === "icon-only" && !leadingIcon && children && (
        <span className="btn__icon">{children}</span>
      )}
      {trailingIcon && (
        <span className="btn__icon btn__icon--trailing">{trailingIcon}</span>
      )}
      {type === "icon-only" && ariaLabel && (
        <span className="btn__tooltip">{ariaLabel}</span>
      )}
    </button>
  );
};
