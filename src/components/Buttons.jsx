import React from "react";

// Original BigButton1 component
function BigButton1(props) {
  const { option, value, onClick } = props;

  const onClickHandler = () => {
    onClick(option);
  };

  return (
    <button
      className="font-medium py-2 md:px-4 rounded-[8px] transition-smooth md:mr-5 mb-5 active-scale shadow-gb1 hover:shadow-gba1 w-[350px] h-[100px] text-xl"
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
      className={`rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-primary-hover transition-smooth active-scale ${className}`}
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
      className={`rounded-md self-center outline outline-[1px] outline-danger px-2.5 py-1.5 text-sm text-danger shadow-gb2 hover:shadow-gba2 hover:text-white hover:bg-danger transition-smooth active-scale w-[86px] h-[32px] text-center cursor-pointer ${className}`}
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
      className={`rounded-md p-2 hover:bg-gray-100 transition-smooth active-scale ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default BigButton1;
