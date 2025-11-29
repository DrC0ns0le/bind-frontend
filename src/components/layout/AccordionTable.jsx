import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { Chevron_down } from "../ui";

// Utility function to combine classNames (replacement for clsx)
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Context for accordion group to enable "only one open at a time" mode
const AccordionGroupContext = createContext(null);

/**
 * AccordionGroup - Optional wrapper to enable accordion mode (only one open at a time)
 * @param {Object} props
 * @param {React.ReactNode} props.children - Accordion components
 * @param {boolean} props.allowMultiple - If false, only one accordion can be open at a time (default: true)
 */
export function AccordionGroup({ children, allowMultiple = true }) {
  const [openId, setOpenId] = useState(null);

  const value = allowMultiple ? null : { openId, setOpenId };

  return (
    <AccordionGroupContext.Provider value={value}>
      {children}
    </AccordionGroupContext.Provider>
  );
}

/**
 * Accordion - Accessible, animated accordion component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Should contain title and content elements
 * @param {string} props.className - Additional classes for the accordion container
 * @param {boolean} props.disableExpand - If true, accordion cannot be expanded
 * @param {boolean} props.defaultOpen - Initial open state (uncontrolled)
 * @param {boolean} props.open - Controlled open state
 * @param {Function} props.onOpenChange - Callback when open state changes
 * @param {string} props.id - Unique ID for accessibility (auto-generated if not provided)
 */
export function Accordion({
  children,
  className = "",
  disableExpand = false,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  id: providedId,
}) {
  const generatedId = useRef(`accordion-${Math.random().toString(36).slice(2, 11)}`);
  const id = providedId || generatedId.current;

  const groupContext = useContext(AccordionGroupContext);
  const isControlledByGroup = groupContext !== null;
  const isControlled = controlledOpen !== undefined;

  // Determine open state based on control mode
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  let isOpen;
  if (isControlled) {
    isOpen = controlledOpen;
  } else if (isControlledByGroup) {
    isOpen = groupContext.openId === id;
  } else {
    isOpen = internalOpen;
  }

  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);
  const prefersReducedMotion = useRef(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handler = (e) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Measure content height dynamically
  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setContentHeight(entry.contentRect.height);
        }
      });

      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  const handleToggle = () => {
    if (disableExpand) return;

    const newOpen = !isOpen;

    if (isControlled) {
      onOpenChange?.(newOpen);
    } else if (isControlledByGroup) {
      groupContext.setOpenId(newOpen ? id : null);
    } else {
      setInternalOpen(newOpen);
    }

    onOpenChange?.(newOpen);
  };

  const handleKeyDown = (e) => {
    if (disableExpand) return;

    // Handle Enter and Space keys
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  // Extract title and content from children
  const childArray = React.Children.toArray(children);
  const titleChild = childArray.find(child => child.type?.displayName === "AccordionTitle");
  const contentChild = childArray.find(child => child.type?.displayName === "AccordionContent");

  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <>
      <button
        type="button"
        id={buttonId}
        role="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-disabled={disableExpand}
        tabIndex={disableExpand ? -1 : 0}
        className={cn(
          "flex flex-row w-full text-left cursor-pointer border-t border-gray-200 dark:border-dark-border dark:text-gray-300 transition-smooth",
          disableExpand && "cursor-default",
          className
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <div
          className={cn(
            "flex flex-col md:flex-row md:items-center py-3 px-4 transition-smooth w-full",
            isOpen && "font-semibold",
            !disableExpand && "hover:font-semibold"
          )}
        >
          {titleChild?.props.children}
        </div>
        {!disableExpand && (
          <div
            className={cn(
              "flex items-center px-4 transition-smooth shrink-0",
              isOpen && "rotate-180"
            )}
            aria-hidden="true"
          >
            <Chevron_down />
          </div>
        )}
      </button>
      {!disableExpand && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className={cn(
            "w-full overflow-hidden",
            prefersReducedMotion.current
              ? "transition-none"
              : "transition-[max-height] duration-300 ease-in-out"
          )}
          style={{
            maxHeight: isOpen ? `${contentHeight}px` : "0px",
          }}
        >
          <div ref={contentRef} className={cn(isOpen && "bg-gray-50 dark:bg-[#151515]")}>
            {contentChild?.props.children}
          </div>
        </div>
      )}
    </>
  );
}

/**
 * AccordionTitle - Wrapper for accordion title content
 */
export function AccordionTitle({ children }) {
  return <>{children}</>;
}
AccordionTitle.displayName = "AccordionTitle";

/**
 * AccordionContent - Wrapper for accordion expandable content
 */
export function AccordionContent({ children }) {
  return <>{children}</>;
}
AccordionContent.displayName = "AccordionContent";

/**
 * TableHeader - Reusable table header component
 */
export function TableHeader({ children, className = "", showChevronSpace = false }) {
  return (
    <div className={cn(
      "flex flex-row items-center rounded-t-lg border border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-header",
      className
    )}>
      <div className="flex flex-col md:flex-row md:items-center py-3 px-4 w-full">
        {children}
      </div>
      {showChevronSpace && (
        <div className="flex items-center px-4 shrink-0 opacity-0" aria-hidden="true">
          <Chevron_down />
        </div>
      )}
    </div>
  );
}
TableHeader.displayName = "TableHeader";

/**
 * TableRow - Reusable table row component
 */
export function TableRow({ children, className = "" }) {
  return (
    <div className={cn("flex flex-row items-center py-2 px-4 dark:text-gray-300", className)}>
      {children}
    </div>
  );
}
TableRow.displayName = "TableRow";

/**
 * AccordionTable - Higher-level table component with accordions
 */
export function AccordionTable({ headers, rows, allowMultiple = true }) {
  const content = (
    <div className="flex flex-col">
      <TableHeader showChevronSpace>
        {Object.entries(headers).map(([header, className]) => (
          <div key={header} className={cn(className, "font-semibold")}>
            {header}
          </div>
        ))}
      </TableHeader>
      <div className="border-x border-b border-gray-200 dark:border-dark-border rounded-b-lg overflow-hidden">
        {rows.map((record) => (
          <Accordion key={record.id || record.name} id={`accordion-${record.id || record.name}`}>
            <AccordionTitle>
              {Object.entries(headers).map(([header, className]) => (
                <div key={record[header.toLowerCase()]} className={className}>
                  {record[header.toLowerCase()]}
                </div>
              ))}
            </AccordionTitle>
            <AccordionContent>
              <p className="p-4">
                I have so much to do but so little time~! Will implement ASAP~
              </p>
            </AccordionContent>
          </Accordion>
        ))}
      </div>
    </div>
  );

  if (allowMultiple) {
    return content;
  }

  return (
    <AccordionGroup allowMultiple={false}>
      {content}
    </AccordionGroup>
  );
}
AccordionTable.displayName = "AccordionTable";

export default AccordionTable;
