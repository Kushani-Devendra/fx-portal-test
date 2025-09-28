import React, { forwardRef, useState } from "react";
import { Circle, AlertCircle } from "lucide-react";
import "./RadioButton.scss";

export interface RadioButtonProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  required?: boolean;
  hintText?: string;
  destructive?: boolean;
  disabled?: boolean;
}

export const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
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

    const inputId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

    const baseClass = "radio-button";
    const destructiveClass = destructive ? "radio-button--destructive" : "";
    const disabledClass = disabled ? "radio-button--disabled" : "";
    const focusedClass = isFocused ? "radio-button--focused" : "";

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
      <div className="radio-button-wrapper">
        <label htmlFor={inputId} className={containerClasses}>
          <input
            ref={ref}
            id={inputId}
            type="radio"
            className="radio-button__input"
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          <span className="radio-button__circle">
            <Circle className="radio-button__icon" />
          </span>
          {label && (
            <span className="radio-button__label">
              {label}
              {required && <span className="radio-button__required">*</span>}
            </span>
          )}
        </label>

        {hintText && (
          <div
            className={`radio-button__hint ${
              destructive ? "radio-button__hint--destructive" : ""
            }`}
          >
            {destructive && (
              <AlertCircle className="radio-button__hint-icon" size={14} />
            )}
            <span>{hintText}</span>
          </div>
        )}
      </div>
    );
  }
);
