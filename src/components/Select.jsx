import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Chevron_down } from "./Icons";

// Utility function to combine classNames
const cn = (...classes) => classes.filter(Boolean).join(" ");

/**
 * Select - Accessible select/combobox component with search and filter capability
 */
export function Select({
  value,
  onChange,
  options = [],
  displayValue = (val) => val,
  placeholder = "Select...",
  name,
  className = "",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const optionsRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;
    const handler = (e) => (prefersReducedMotion.current = e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Filter options based on query
  const filteredOptions = query
    ? options.filter((option) =>
        String(option).toLowerCase().includes(query.toLowerCase())
      )
    : options;

  // Reset all state when closing
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setActiveIndex(-1);
    setDropdownPosition(null);
    setIsEditing(false);
  }, []);

  // Update dropdown position
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;

    const updatePosition = () => {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      const clickedOutside =
        containerRef.current && !containerRef.current.contains(event.target) &&
        optionsRef.current && !optionsRef.current.contains(event.target);

      if (clickedOutside) closeDropdown();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeDropdown]);

  // Scroll active option into view
  useEffect(() => {
    if (!isOpen || activeIndex < 0 || !optionsRef.current) return;

    const activeElement = optionsRef.current.children[activeIndex];
    activeElement?.scrollIntoView({
      block: "nearest",
      behavior: prefersReducedMotion.current ? "auto" : "smooth",
    });
  }, [activeIndex, isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;

      case "Enter":
        e.preventDefault();
        if (isOpen && activeIndex >= 0 && filteredOptions[activeIndex]) {
          handleSelect(filteredOptions[activeIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;

      case "Escape":
        e.preventDefault();
        closeDropdown();
        inputRef.current?.blur();
        break;

      case "Tab":
        if (isOpen) {
          closeDropdown();
        }
        break;

      default:
        break;
    }
  };

  const handleSelect = (option) => {
    onChange(option);
    closeDropdown();
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setIsEditing(true);
    setActiveIndex(0);
    if (!isOpen) setIsOpen(true);
  };

  const handleButtonClick = () => {
    if (disabled) return;
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    if (newOpenState) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  };

  const displayText = value ? displayValue(value) : "";
  const inputValue = isEditing ? query : displayText;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => !disabled && setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={`${name}-options`}
          aria-activedescendant={
            activeIndex >= 0 ? `${name}-option-${activeIndex}` : undefined
          }
          className={cn(
            "font-mono block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 dark:bg-dark-elevated",
            "shadow-gb2 dark:shadow-dark-gb2 hover:shadow-gba2 dark:hover:shadow-dark-gba2 transition-smooth",
            "ring-1 ring-inset ring-gray-300 dark:ring-dark-border",
            "placeholder:text-gray-400 dark:placeholder:text-gray-600",
            "focus:ring-2 focus:ring-inset focus:ring-gray-800 dark:focus:ring-gray-500 outline-none",
            "md:text-sm md:leading-6",
            disabled && "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
          )}
        />
        {/* Chevron Button */}
        <button
          type="button"
          onClick={handleButtonClick}
          disabled={disabled}
          tabIndex={-1}
          aria-label="Toggle dropdown"
          className={cn(
            "absolute inset-y-0 right-0 flex items-center pr-2 dark:text-gray-300",
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          )}
        >
          <div className={cn("transition-smooth", isOpen && "rotate-180")}>
            <Chevron_down additionalClass="scale-75" />
          </div>
        </button>
      </div>

      {/* Dropdown Options - Rendered via Portal */}
      {isOpen && dropdownPosition && createPortal(
        <div
          id={`${name}-options`}
          role="listbox"
          ref={optionsRef}
          className={cn(
            "fixed z-[9999] mt-1 max-h-32 overflow-auto rounded-md bg-white dark:bg-dark-elevated py-1",
            "shadow-gb2 dark:shadow-dark-gb2 ring-1 ring-gray-300 dark:ring-dark-border",
            prefersReducedMotion.current
              ? ""
              : "animate-in fade-in duration-200"
          )}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
          }}
        >
          {filteredOptions.length === 0 ? (
            <div className="px-2 py-2 text-sm text-gray-500 dark:text-gray-500 font-mono">
              No results found
            </div>
          ) : (
            <ul>
              {filteredOptions.map((option, index) => {
                const isActive = index === activeIndex;
                const isSelected = option === value;

                return (
                  <li
                    key={`${name}-option-${index}`}
                    id={`${name}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "cursor-pointer select-none px-2 py-2 text-sm font-mono dark:text-gray-300",
                      (isActive || isSelected) && "font-bold",
                      isActive && "bg-gray-100 dark:bg-dark-hover"
                    )}
                  >
                    {displayValue(option)}
                  </li>
                );
              })}
            </ul>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

Select.displayName = "Select";

export default Select;
