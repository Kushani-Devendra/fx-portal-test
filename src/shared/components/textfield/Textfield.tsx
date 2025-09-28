import React, { ReactElement, forwardRef, useState } from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import "./Textfield.scss";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface TextFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  type?: "text" | "leading-dropdown" | "trailing-dropdown" | "trailing-button";
  size?: "sm" | "md";
  label?: string;
  required?: boolean;
  leadingIcon?: ReactElement;
  trailingIcon?: ReactElement;
  hintText?: string;
  destructive?: boolean;
  disabled?: boolean;
  // Dropdown specific props
  dropdownOptions?: DropdownOption[];
  selectedDropdownValue?: string;
  onDropdownChange?: (value: string) => void;
  // Button specific props
  buttonText?: string;
  onButtonClick?: () => void;
  buttonIcon?: ReactElement;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      type = "text",
      size = "md",
      label,
      required = false,
      leadingIcon,
      trailingIcon,
      hintText,
      destructive = false,
      disabled = false,
      dropdownOptions = [],
      selectedDropdownValue,
      onDropdownChange,
      buttonText,
      onButtonClick,
      buttonIcon,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false);

    // Generate unique ID if not provided
    const inputId =
      id || `textfield-${Math.random().toString(36).substr(2, 9)}`;

    const baseClass = "textfield";
    const sizeClass = `textfield--${size}`;
    const destructiveClass = destructive ? "textfield--destructive" : "";
    const disabledClass = disabled ? "textfield--disabled" : "";
    const focusedClass = isFocused ? "textfield--focused" : "";

    const containerClasses = [
      baseClass,
      sizeClass,
      destructiveClass,
      disabledClass,
      focusedClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleDropdownToggle = () => {
      if (!disabled) {
        if (!isDropdownOpen) {
          // Opening dropdown
          setShouldRenderDropdown(true);
          // Small delay to ensure DOM is updated before animation
          setTimeout(() => setIsDropdownOpen(true), 10);
        } else {
          // Closing dropdown
          setIsDropdownOpen(false);
          // Wait for animation to complete before removing from DOM
          setTimeout(() => setShouldRenderDropdown(false), 150);
        }
      }
    };

    const handleDropdownSelect = (value: string) => {
      onDropdownChange?.(value);
      // Close dropdown with animation
      setIsDropdownOpen(false);
      setTimeout(() => setShouldRenderDropdown(false), 150);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      // Delay blur to allow dropdown clicks
      setTimeout(() => {
        setIsFocused(false);
        if (isDropdownOpen) {
          setIsDropdownOpen(false);
          setTimeout(() => setShouldRenderDropdown(false), 150);
        }
      }, 150);
      props.onBlur?.(e);
    };

    const renderDropdown = (isLeading: boolean = false) => {
      const selectedOption = dropdownOptions.find(
        (opt) => opt.value === selectedDropdownValue
      );

      return (
        <div
          className={`textfield__dropdown ${
            isLeading
              ? "textfield__dropdown--leading"
              : "textfield__dropdown--trailing"
          }`}
        >
          <button
            type="button"
            className="textfield__dropdown-trigger"
            onClick={handleDropdownToggle}
            onMouseDown={(e) => e.preventDefault()} // Prevent input blur
            disabled={disabled}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
          >
            <span className="textfield__dropdown-text">
              {selectedOption?.label || "Select"}
            </span>
            <ChevronDown
              className={`textfield__dropdown-icon ${
                isDropdownOpen ? "textfield__dropdown-icon--open" : ""
              }`}
              size={16}
            />
          </button>
          {shouldRenderDropdown && (
            <div
              className={`textfield__dropdown-menu ${
                isDropdownOpen ? "textfield__dropdown-menu--open" : ""
              }`}
            >
              {dropdownOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`textfield__dropdown-item ${
                    option.value === selectedDropdownValue
                      ? "textfield__dropdown-item--selected"
                      : ""
                  }`}
                  onClick={() => handleDropdownSelect(option.value)}
                  onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      );
    };

    const renderTrailingButton = () => (
      <button
        type="button"
        className="textfield__button"
        onClick={onButtonClick}
        disabled={disabled}
      >
        {buttonIcon && (
          <span className="textfield__button-icon">{buttonIcon}</span>
        )}
        {buttonText && (
          <span className="textfield__button-text">{buttonText}</span>
        )}
      </button>
    );

    return (
      <div className="textfield-wrapper">
        {label && (
          <label className="textfield__label" htmlFor={inputId}>
            {label}
            {required && <span className="textfield__required">*</span>}
          </label>
        )}

        <div className={containerClasses}>
          {type === "leading-dropdown" && renderDropdown(true)}

          {leadingIcon && !["leading-dropdown"].includes(type) && (
            <span className="textfield__icon textfield__icon--leading">
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type="text"
            className="textfield__input"
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {trailingIcon &&
            !["trailing-dropdown", "trailing-button"].includes(type) && (
              <span className="textfield__icon textfield__icon--trailing">
                {trailingIcon}
              </span>
            )}

          {type === "trailing-dropdown" && renderDropdown(false)}
          {type === "trailing-button" && renderTrailingButton()}
        </div>

        {hintText && (
          <div
            className={`textfield__hint ${
              destructive ? "textfield__hint--destructive" : ""
            }`}
          >
            {destructive && (
              <AlertCircle className="textfield__hint-icon" size={14} />
            )}
            <span>{hintText}</span>
          </div>
        )}
      </div>
    );
  }
);
