import React, { forwardRef, useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import "./Checkbox.scss";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  required?: boolean;
  hintText?: string;
  destructive?: boolean;
  disabled?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      required = false,
      hintText,
      destructive = false,
      disabled = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const inputId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const baseClass = "checkbox";
    const destructiveClass = destructive ? "checkbox--destructive" : "";
    const disabledClass = disabled ? "checkbox--disabled" : "";
    const focusedClass = isFocused ? "checkbox--focused" : "";

    const containerClasses = [
      baseClass,
      destructiveClass,
      disabledClass,
      focusedClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="checkbox-wrapper">
        <label htmlFor={inputId} className={containerClasses}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="checkbox__input"
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <span className="checkbox__box">
            <Check className="checkbox__icon" size={14} />
          </span>
          {label && (
            <span className="checkbox__label">
              {label}
              {required && <span className="checkbox__required">*</span>}
            </span>
          )}
        </label>

        {hintText && (
          <div
            className={`checkbox__hint ${
              destructive ? "checkbox__hint--destructive" : ""
            }`}
          >
            {destructive && (
              <AlertCircle className="checkbox__hint-icon" size={14} />
            )}
            <span>{hintText}</span>
          </div>
        )}
      </div>
    );
  }
);
