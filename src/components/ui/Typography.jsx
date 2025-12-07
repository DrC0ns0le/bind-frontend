import React from "react";

// Large page heading - responsive sizing
export function PageHeading({ children, className = "", ...props }) {
  return (
    <h1
      className={`text-6xl md:text-8xl font-black tracking-tight leading-tight text-primary transition-smooth overflow-x-auto ${className}`}
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
      className={`text-2xl leading-normal mt-4 text-primary transition-smooth ${className}`}
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
      className={`font-mono text-xl font-black leading-normal p-2 pl-1 text-secondary tracking-tight transition-smooth ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}
