import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
// import TopBar from "./TopBar";
import { useIsMdOrLarger } from "../../hooks/useMediaQuery";

function Frame(props) {
  const { location, breadcrumbs } = props;
  const isMdOrLarger = useIsMdOrLarger();

  // Initialize isPinned from localStorage (desktop only)
  const [isPinned, setIsPinned] = useState(() => {
    // Check if we're on mobile during initialization
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return false;
    }
    const stored = localStorage.getItem('sidebarPinned');
    return stored ? JSON.parse(stored) : false;
  });
  const [isHovered, setIsHovered] = useState(false);
  const [wasMobile, setWasMobile] = useState(!isMdOrLarger);

  const isExpanded = isPinned || (isHovered && !isPinned);

  // Reset sidebar state when switching FROM desktop TO mobile
  useEffect(() => {
    if (!isMdOrLarger && wasMobile === false) {
      setIsPinned(false);
      setIsHovered(false);
    }
    setWasMobile(!isMdOrLarger);
  }, [isMdOrLarger]);

  // Persist isPinned to localStorage whenever it changes (desktop only)
  useEffect(() => {
    if (isMdOrLarger) {
      localStorage.setItem('sidebarPinned', JSON.stringify(isPinned));
    }
  }, [isPinned, isMdOrLarger]);

  const handleToggle = () => {
    setIsPinned(!isPinned);
    setIsHovered(false);
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-row justify-center overflow-x-hidden transition-smooth">
        <div className="w-full max-w-screen-2xl flex flex-row min-w-0 transition-smooth">
          {/* Mobile overlay - close sidebar when tapping outside */}
          {!isMdOrLarger && isExpanded && (
            <div
              className="fixed inset-0"
              style={{ zIndex: 5 }}
              onClick={() => setIsPinned(false)}
            />
          )}

          {/* Sidebar - always visible on desktop, hidden on mobile unless expanded */}
          <div
            className={`${
              isMdOrLarger ? (isExpanded ? "w-56" : "w-24") : (isExpanded ? "w-56" : "w-0")
            } relative flex-shrink-0 transition-smooth`}
          >
            <div
              className={`${
                isExpanded ? "fixed top-0 h-screen" : "relative h-full"
              } overflow-hidden transition-smooth z-10`}
              onMouseEnter={() => isMdOrLarger && setIsHovered(true)}
              onMouseLeave={() => isMdOrLarger && setIsHovered(false)}
            >
              <Sidebar location={location} isExpanded={isExpanded} isPinned={isPinned} onToggle={handleToggle} />
            </div>
          </div>
          <div className="flex flex-col flex-1 p-4 pb-1 md:pl-0 md:pr-12 md:pt-12 md:pb-2 w-full min-w-0 transition-smooth">
            <Breadcrumb items={breadcrumbs || [{ label: location }]} location={location} isExpanded={isExpanded} onToggle={handleToggle} isMobile={!isMdOrLarger} />
            <div className="grow">{props.children}</div>
            <footer className="text-xs md:text-sm text-secondary text-center font-light self-center py-1 md:py-4 md:pt-8 transition-smooth">
              Copyright 2024 Lee Jack Sonz. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Frame;
