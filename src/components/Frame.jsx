import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "react-responsive";

function Frame(props) {
  const { location } = props;
  const isMdOrLarger = useMediaQuery({ minWidth: 1080 });

  const [showSidebar, setShowSidebar] = useState(isMdOrLarger);

  const nav_hamburger = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-8 h-8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
      />
    </svg>
  );

  return (
    <>
      <div>
        <div className="h-screen w-screen flex flex-row justify-center">
          <div
            className={`bg-gray-150 ${
              showSidebar ? "md:pl-32 w-[1%] min-w-24" : "w-0 min-w-0"
            } max-w-128 overflow-hidden sidebar-width transition-smooth`}
          >
            <Sidebar location={location} />
          </div>
          <div className="flex flex-col bg-gray-150 p-4 pb-1 sm:p-12 sm:pb-2 2xl:px-48 w-full max-w-screen-2xl overflow-auto">
            <button className="pb-4" onClick={() => setShowSidebar(!showSidebar)}>
              {nav_hamburger}
            </button>

            <div className="grow">{props.children}</div>
            <footer className="text-xs sm:text-sm text-gray-600 text-center font-light self-center py-1 sm:py-4 sm:pt-8">
              Copyright © 2024 Lee Jack Sonz. All rights reserved.
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Frame;
