import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useMediaQuery } from "react-responsive";

function Frame(props) {
  const { location } = props;
  const isMdOrLarger = useMediaQuery({ minWidth: 768 });

  const [showSidebar, setShowSidebar] = useState(isMdOrLarger);

  const nav_hamburger = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
      />
    </svg>
  );

  return (
    <>
      <div>
        <div class="h-screen w-screen flex justify-center">
          <div
            class={`bg-gray-150 ${
              showSidebar ? "md:pl-32 w-[1%] min-w-24" : "w-0 min-w-0"
            } max-w-128 overflow-hidden sidebar-width ease-in-out duration-500`}
          >
            <Sidebar location={location} />
          </div>
          <div class="bg-gray-150 p-12 w-full max-w-screen-2xl overflow-auto">
            <button
              class="pb-4 ml-2 scale-125"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {nav_hamburger}
            </button>
            {props.children}
          </div>
        </div>
      </div>
      <footer class="text-sm text-gray-600 text-center font-light sticky overflow-hidden bg-white op w-screen p-4">
        Copyright © 2024 Lee Jack Sonz. All rights reserved.
      </footer>
    </>
  );
}

export default Frame;
