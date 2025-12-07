import React, { forwardRef } from "react";

// Standard text input with shadows and focus states
export const TextInput = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      className={`input-base shadow-input ${className}`}
      {...props}
    />
  );
});

TextInput.displayName = "TextInput";

// Number input variant
export const NumberInput = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="number"
      className={`input-base shadow-input ${className}`}
      {...props}
    />
  );
});

NumberInput.displayName = "NumberInput";

// Textarea variant
export const TextArea = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`input-base shadow-input ${className}`}
      {...props}
    />
  );
});

TextArea.displayName = "TextArea";

// Search input with embedded label (used in tables)
export const SearchInput = forwardRef(({ label, className = "", ...props }, ref) => {
  return (
    <div className="relative">
      {label && (
        <label className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-tertiary pointer-events-none">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type="text"
        className={`input-base shadow-input ${label ? 'pl-20' : ''} ${className}`}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
