import React from "react";

// Large page heading - responsive sizing
export function PageHeading({ children, className = "", ...props }) {
  return (
    <h1
      className={`text-6xl sm:text-8xl font-black tracking-tight dark:text-gray-200 transition-smooth ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}

// Subheading - used for page subtitles
export function Subheading({ children, className = "", ...props }) {
  return (
    <h2
      className={`text-2xl mt-4 dark:text-gray-300 transition-smooth ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

// Section label - monospace uppercase labels for sections
export function SectionLabel({ children, className = "", ...props }) {
  return (
    <h3
      className={`font-mono text-xl font-black p-2 pl-2 text-primary dark:text-gray-400 tracking-tight transition-smooth ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}
