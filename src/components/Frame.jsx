import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Breadcrumb from "./Breadcrumb";
// import TopBar from "./TopBar";
import { useMediaQuery } from "react-responsive";

function Frame(props) {
  const { location, breadcrumbs } = props;
  const isMdOrLarger = useMediaQuery({ minWidth: 768 });

  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isExpanded = isPinned || (isHovered && !isPinned);

  const handleToggle = () => {
    setIsPinned(!isPinned);
    setIsHovered(false);
  };

  return (
    <>
      <div className="min-h-screen w-full flex flex-row justify-center dark:bg-dark-bg bg-gray-150 overflow-hidden transition-smooth">
        <div className="w-full max-w-screen-2xl flex flex-row dark:bg-dark-bg bg-gray-150 min-w-0 transition-smooth">
          {/* Sidebar - always visible on desktop, hidden on mobile unless expanded */}
          <div
            className={`${
              isMdOrLarger ? (isExpanded ? "w-40" : "w-16") : (isExpanded ? "w-40" : "w-0")
            } fixed top-0 h-screen overflow-hidden transition-smooth dark:bg-dark-bg bg-gray-150 flex-shrink-0 z-10`}
            onMouseEnter={() => isMdOrLarger && setIsHovered(true)}
            onMouseLeave={() => isMdOrLarger && setIsHovered(false)}
          >
            <Sidebar location={location} isExpanded={isExpanded} onToggle={handleToggle} />
          </div>
          <div className={`flex flex-col flex-1 p-4 pb-1 sm:pr-12 sm:pt-12 sm:pb-2 w-full transition-smooth ${
            isExpanded ? "ml-40" : (isMdOrLarger ? "ml-16" : "")
          }`}>
            <Breadcrumb items={breadcrumbs || [{ label: location }]} location={location} isExpanded={isExpanded} onToggle={handleToggle} isMobile={!isMdOrLarger} />
            <div className="grow">{props.children}</div>
            <footer className="text-xs sm:text-sm text-gray-600 dark:text-gray-500 text-center font-light self-center py-1 sm:py-4 sm:pt-8 transition-smooth">
              Copyright © 2024 Lee Jack Sonz. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Frame;
