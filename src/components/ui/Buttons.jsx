import React from "react";

/**
 * TWO MAJOR BUTTON STYLES:
 * 1. Dark Background (btn-dark) - For primary/accent actions
 * 2. Light Background (btn-light) - For secondary/surface actions
 */

// ========================================
// STYLE 1: DARK BACKGROUND BUTTONS
// ========================================

// Primary action button - dark background with white text
export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`btn-base btn-dark shadow-button hover-scale ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Icon button variant with dark background
export function IconButton({ children, className = "", ...props }) {
  return (
    <button
      className={`btn-base shadow-button hover-scale p-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ========================================
// STYLE 2: LIGHT BACKGROUND BUTTONS
// ========================================

// Large navigation button - light background with elevated surface
function BigButton1(props) {
  const { option, value, description, onClick, alignLeft = false } = props;

  const onClickHandler = () => {
    onClick(option);
  };

  const alignmentClasses = alignLeft
    ? "items-start text-left"
    : "items-center text-center";

  return (
    <button
      className={`btn-base shadow-button hover-scale surface-elevated font-medium text-primary md:px-4 md:mr-5 mb-5 w-[350px] h-[100px] flex flex-col justify-center ${alignmentClasses}`}
      onClick={() => {
        onClickHandler();
      }}
    >
      <div className="text-xl">{value}</div>
      {description && (
        <div className="text-sm font-normal text-secondary mt-1">
          {description}
        </div>
      )}
    </button>
  );
}

// Danger/destructive action button - red outline with light background
export function DangerButton({ children, className = "", ...props }) {
  return (
    <button
      className={`btn-base btn-light shadow-button hover-scale outline outline-[1px] outline-danger text-danger hover:text-white hover:bg-danger self-center w-[86px] h-[32px] flex items-center justify-center text-center ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default BigButton1;
