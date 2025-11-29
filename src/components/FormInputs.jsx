import React, { forwardRef } from "react";

// Standard text input with shadows and focus states
export const TextInput = forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="text"
      className={`font-mono block px-2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 bg-white dark:bg-dark-elevated shadow-gb2 dark:shadow-dark-gb2 hover:shadow-gba2 dark:hover:shadow-dark-gba2 transition-smooth ring-1 ring-inset ring-gray-300 dark:ring-dark-border placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gray-800 dark:focus:ring-gray-500 outline-none md:text-sm md:leading-6 ${className}`}
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
      className={`font-mono block px-2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 bg-white dark:bg-dark-elevated shadow-gb2 dark:shadow-dark-gb2 hover:shadow-gba2 dark:hover:shadow-dark-gba2 transition-smooth ring-1 ring-inset ring-gray-300 dark:ring-dark-border placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gray-800 dark:focus:ring-gray-500 outline-none md:text-sm md:leading-6 ${className}`}
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
      className={`font-mono block px-2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 bg-white dark:bg-dark-elevated shadow-gb2 dark:shadow-dark-gb2 hover:shadow-gba2 dark:hover:shadow-dark-gba2 transition-smooth ring-1 ring-inset ring-gray-300 dark:ring-dark-border placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gray-800 dark:focus:ring-gray-500 outline-none md:text-sm md:leading-6 ${className}`}
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
        <label className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-500 pointer-events-none">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type="text"
        className={`font-mono block px-2 rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-200 bg-white dark:bg-dark-elevated shadow-gb2 dark:shadow-dark-gb2 hover:shadow-gba2 dark:hover:shadow-dark-gba2 transition-smooth ring-1 ring-inset ring-gray-300 dark:ring-dark-border placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-gray-800 dark:focus:ring-gray-500 outline-none md:text-sm md:leading-6 ${label ? 'pl-20' : ''} ${className}`}
        {...props}
      />
    </div>
  );
});

SearchInput.displayName = "SearchInput";
