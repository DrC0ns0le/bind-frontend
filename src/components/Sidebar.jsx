import React from "react";
import { ThemeToggle } from "./ThemeToggle";

function Sidebar(props) {
  const { location, isExpanded = false, isPinned = false, onToggle } = props;
  const hamburgerPosRef = React.useRef(null);
  const [isReady, setIsReady] = React.useState(false);

  const toggleIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={`w-6 h-6 transition-transform duration-300 ${isPinned ? '' : 'scale-x-[-1]'}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    </svg>
  );

  // Mark as ready after mount
  React.useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timeout);
  }, []);
  const options = [
    {
      text: "home",
      path: "/",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      text: "zones",
      path: "/zones",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
        </svg>
      )
    },
    {
      text: "global",
      path: "/global",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      )
    },
    {
      text: "apply",
      path: "/apply",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
        </svg>
      )
    },
  ];

  return (
    <nav className={`h-screen flex flex-col pl-4 sm:pl-12 transition-all duration-300 ${
      isExpanded ? "pr-8 sm:pr-16" : "pr-2 sm:pr-4"
    }`}>
      {/* Top section - contains everything that should align at top */}
      <div className="pt-4 sm:pt-12 flex-shrink-0">
        {/* Branding - visible when expanded */}
        <div className={`transition-all duration-300 ${
          isExpanded ? "opacity-100 mb-12" : "opacity-0 pointer-events-none h-0 overflow-hidden mb-0"
        }`}>
          <div className="flex flex-col">
            <span className="text-lg font-bold dark:text-gray-200 text-gray-900 tracking-tight">BIND</span>
            <span className="text-xs dark:text-gray-500 text-gray-600 font-light tracking-wide">Management</span>
          </div>
        </div>

        {/* Active icon - visible when collapsed */}
        {options.map((item) => {
          const isActive = location === item.text;
          if (!isActive) return null;

          return (
            <div
              key={item.text}
              className={`transition-all duration-300 ${
                isExpanded ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100"
              }`}
            >
              <a
                className="flex items-center group hover:drop-shadow-4xl transition-smooth drop-shadow-ps1 dark:drop-shadow-dark-ps1 dark:text-gray-300 font-bold"
                href={item.path}
                title={item.text}
              >
                <span className="flex-shrink-0 [&>svg]:stroke-[2] hover-scale">
                  {item.icon}
                </span>
              </a>
            </div>
          );
        })}

        {/* Navigation Links - visible when expanded */}
        <ul className={`flex flex-col text-base gap-6 items-start transition-all duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
        }`} key={"primary nav"}>
          {options.map((item) => {
            const isActive = location === item.text;

            return (
              <li key={item.text}>
                <a
                  className={`flex items-center group hover:drop-shadow-4xl transition-smooth drop-shadow-ps1 dark:drop-shadow-dark-ps1 dark:text-gray-300 ${
                    isActive ? "font-bold" : ""
                  }`}
                  key={item.text}
                  href={item.path}
                >
                  <div className="flex items-center hover-scale">
                    <span className={`flex-shrink-0 ${
                      isActive ? "[&>svg]:stroke-[2]" : "[&>svg]:stroke-[1.5]"
                    }`}>
                      {item.icon}
                    </span>
                    <span className={`capitalize whitespace-nowrap ml-3`}>
                      {item.text}
                    </span>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Spacer to push bottom controls to bottom */}
      <div className="flex-1"></div>

      {/* Bottom section - Hamburger and Theme Toggle */}
      <div className="pb-8 sm:pb-12 flex items-center gap-4">
        {/* Toggle button - only visible when expanded */}
        <div className={`transition-all duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none w-0 overflow-hidden"
        }`} style={{
          transitionDelay: isExpanded ? '150ms' : '0ms'
        }}>
          <button
            className="dark:text-gray-300 hover:drop-shadow-4xl transition-smooth"
            onClick={onToggle}
            title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <div className="hover-scale">
              {toggleIcon}
            </div>
          </button>
        </div>

        {/* Theme Toggle - hidden when collapsed */}
        <div className={`transition-all duration-300 ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
