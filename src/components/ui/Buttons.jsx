import React from "react";

// Original BigButton1 component
function BigButton1(props) {
  const { option, value, onClick } = props;

  const onClickHandler = () => {
    onClick(option);
  };

  return (
    <button
      className="font-medium py-2 md:px-4 rounded-[8px] transition-smooth md:mr-5 mb-5 hover-scale shadow-gb1 dark:shadow-dark-gb1 hover:shadow-gba1 dark:hover:shadow-dark-gba1 dark:bg-dark-elevated w-[350px] h-[100px] text-xl dark:text-gray-300"
      onClick={() => {
        onClickHandler();
      }}
    >
      {value}
    </button>
  );
}

// Primary Button - Dark button with shadows (most commonly used)
export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-md bg-primary dark:bg-dark-elevated px-4 py-2 text-sm font-semibold text-white shadow-gb1 dark:shadow-dark-gb1 hover:shadow-gba1 dark:hover:shadow-dark-gba1 hover:bg-primary-hover dark:hover:bg-dark-hover transition-smooth hover-scale ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Danger Button - Red outline button with fill on hover
export function DangerButton({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-md self-center outline outline-[1px] outline-danger px-2.5 py-1.5 text-sm text-danger shadow-gb1 dark:shadow-dark-gb1 hover:shadow-gba1 dark:hover:shadow-dark-gba1 hover:text-white hover:bg-danger transition-smooth hover-scale w-[86px] h-[32px] text-center cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Icon Button - For buttons with icons
export function IconButton({ children, className = "", ...props }) {
  return (
    <button
      className={`rounded-md p-2 hover:bg-gray-100 dark:hover:bg-dark-hover shadow-gb1 dark:shadow-dark-gb1 hover:shadow-gba1 dark:hover:shadow-dark-gba1 transition-smooth hover-scale ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default BigButton1;
