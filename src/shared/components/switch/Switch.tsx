import React, { forwardRef, useState } from "react";
import "./Switch.scss";
import { AlertCircle } from "lucide-react";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  required?: boolean;
  hintText?: string;
  destructive?: boolean;
  disabled?: boolean;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
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

    const inputId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    const baseClass = "switch";
    const destructiveClass = destructive ? "switch--destructive" : "";
    const disabledClass = disabled ? "switch--disabled" : "";
    const focusedClass = isFocused ? "switch--focused" : "";

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
      <div className="switch-wrapper">
        <label htmlFor={inputId} className={containerClasses}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className="switch__input"
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <span className="switch__track">
            <span className="switch__thumb" />
          </span>
          {label && (
            <span className="switch__label">
              {label}
              {required && <span className="switch__required">*</span>}
            </span>
          )}
        </label>

        {hintText && (
          <div
            className={`switch__hint ${
              destructive ? "switch__hint--destructive" : ""
            }`}
          >
            {destructive && (
              <AlertCircle className="switch__hint-icon" size={14} />
            )}
            <span>{hintText}</span>
          </div>
        )}
      </div>
    );
  }
);
