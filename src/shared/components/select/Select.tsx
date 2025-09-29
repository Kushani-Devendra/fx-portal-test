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
  autoComplete?: boolean;
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
      autoComplete = false,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    // Filter options based on search query for autocomplete
    const filteredOptions =
      autoComplete && searchQuery
        ? options.filter((option) =>
            option.label.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : options;

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
      setSearchQuery("");
      setIsDropdownOpen(false);
      setTimeout(() => setShouldRenderDropdown(false), 150);
      if (autoComplete && inputRef.current) {
        inputRef.current.blur();
      }
    };

    const handleFocus = () => {
      if (!disabled) {
        setIsFocused(true);
        if (autoComplete) {
          setShouldRenderDropdown(true);
          setTimeout(() => setIsDropdownOpen(true), 10);
        }
      }
    };

    const handleBlur = () => {
      setTimeout(() => {
        setIsFocused(false);
        setSearchQuery("");
      }, 150);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);

      // If user is editing a selected value, reset the selection
      if (selectedOption && query !== selectedOption.label) {
        onChange?.("");
      }

      if (!isDropdownOpen) {
        setShouldRenderDropdown(true);
        setTimeout(() => setIsDropdownOpen(true), 10);
      }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && filteredOptions.length === 1) {
        handleDropdownSelect(filteredOptions[0].value);
        inputRef.current?.blur();
      }
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
            className={`select__dropdown ${
              autoComplete ? "select__dropdown--autocomplete" : ""
            }`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            tabIndex={autoComplete ? -1 : disabled ? -1 : 0}
          >
            {autoComplete ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  className="select__input"
                  value={
                    searchQuery ||
                    (isFocused ? "" : selectedOption?.label || "")
                  }
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleInputKeyDown}
                  placeholder={placeholder}
                  disabled={disabled}
                  // aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                  aria-labelledby={label ? `${selectId}-label` : undefined}
                />
                <ChevronDown
                  className={`select__chevron ${
                    isDropdownOpen ? "select__chevron--open" : ""
                  }`}
                  size={20}
                />
              </>
            ) : (
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
                    <span className="select__selected-label">
                      {selectedOption.label}
                    </span>
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
            )}

            {shouldRenderDropdown && (
              <div
                className={`select__dropdown-menu ${
                  isDropdownOpen ? "select__dropdown-menu--open" : ""
                }`}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
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
                  ))
                ) : (
                  <div className="select__no-results">No results found</div>
                )}
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
