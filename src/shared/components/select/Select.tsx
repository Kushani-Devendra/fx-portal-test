import React, {
  ReactElement,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import { AlertCircle, ChevronDown } from "lucide-react";
import "./Select.scss";

export interface SelectOption {
  label: string;
  value: string;
  leadingIcon?: ReactElement;
  subDescription?: string;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  size?: "sm" | "md";
  label?: string;
  required?: boolean;
  placeholder?: string;
  hintText?: string;
  destructive?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      size = "md",
      label,
      required = false,
      placeholder = "Select an option",
      hintText,
      destructive = false,
      disabled = false,
      value,
      onChange,
      options = [],
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    const baseClass = "select";
    const sizeClass = `select--${size}`;
    const destructiveClass = destructive ? "select--destructive" : "";
    const disabledClass = disabled ? "select--disabled" : "";
    const focusedClass = isFocused ? "select--focused" : "";

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

    // Handle clicks outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          if (isDropdownOpen) {
            setIsDropdownOpen(false);
            setTimeout(() => setShouldRenderDropdown(false), 150);
          }
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isDropdownOpen]);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleDropdownToggle = () => {
      if (!disabled) {
        if (!isDropdownOpen) {
          setShouldRenderDropdown(true);
          setTimeout(() => setIsDropdownOpen(true), 10);
        } else {
          setIsDropdownOpen(false);
          setTimeout(() => setShouldRenderDropdown(false), 150);
        }
      }
    };

    const handleDropdownSelect = (selectedValue: string) => {
      onChange?.(selectedValue);
      setIsDropdownOpen(false);
      setTimeout(() => setShouldRenderDropdown(false), 150);
    };

    const handleFocus = () => {
      if (!disabled) {
        setIsFocused(true);
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsFocused(false);
      }, 150);
    };

    return (
      <div className="select-wrapper">
        {label && (
          <label className="select__label" htmlFor={selectId}>
            {label}
            {required && <span className="select__required">*</span>}
          </label>
        )}

        <div ref={ref} className={containerClasses} {...props}>
          <div
            ref={dropdownRef}
            className="select__dropdown"
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={disabled ? -1 : 0}
          >
            <button
              type="button"
              className="select__trigger"
              onClick={handleDropdownToggle}
              onMouseDown={(e) => e.preventDefault()}
              disabled={disabled}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              aria-labelledby={label ? `${selectId}-label` : undefined}
            >
              <div className="select__trigger-content">
                {selectedOption ? (
                  <div className="select__selected-option">
                    {selectedOption.leadingIcon && (
                      <span className="select__selected-icon">
                        {selectedOption.leadingIcon}
                      </span>
                    )}
                    <div className="select__selected-text">
                      <span className="select__selected-label">
                        {selectedOption.label}
                      </span>
                      {selectedOption.subDescription && (
                        <span className="select__selected-description">
                          {selectedOption.subDescription}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="select__placeholder">{placeholder}</span>
                )}
              </div>
              <ChevronDown
                className={`select__chevron ${
                  isDropdownOpen ? "select__chevron--open" : ""
                }`}
                size={20}
              />
            </button>

            {shouldRenderDropdown && (
              <div
                className={`select__dropdown-menu ${
                  isDropdownOpen ? "select__dropdown-menu--open" : ""
                }`}
              >
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`select__dropdown-item ${
                      option.value === value
                        ? "select__dropdown-item--selected"
                        : ""
                    }`}
                    onClick={() => handleDropdownSelect(option.value)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {option.leadingIcon && (
                      <span className="select__option-icon">
                        {option.leadingIcon}
                      </span>
                    )}
                    <div className="select__option-text">
                      <span className="select__option-label">
                        {option.label}
                      </span>
                      {option.subDescription && (
                        <span className="select__option-description">
                          {option.subDescription}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {hintText && (
          <div
            className={`select__hint ${
              destructive ? "select__hint--destructive" : ""
            }`}
          >
            {destructive && (
              <AlertCircle className="select__hint-icon" size={14} />
            )}
            <span>{hintText}</span>
          </div>
        )}
      </div>
    );
  }
);
