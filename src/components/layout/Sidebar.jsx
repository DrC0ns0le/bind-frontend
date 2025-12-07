import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMdOrLarger } from "../../hooks/useMediaQuery";

function Sidebar(props) {
  const { location, isExpanded = false, isPinned = false, onToggle } = props;
  const hamburgerPosRef = React.useRef(null);
  const [isReady, setIsReady] = React.useState(false);
  const isMdOrLarger = useIsMdOrLarger();

  // Mobile: Show left arrow, Desktop: Show pin/unpin icon
  const toggleIcon = !isMdOrLarger ? (
    // Left arrow for mobile
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5L8.25 12l7.5-7.5"
      />
    </svg>
  ) : isPinned ? (
    // Pinned icon for desktop
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
    >
      <path
        d="M6 4C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M6 6H9V18H6C5.44772 18 5 17.5523 5 17V7C5 6.44772 5.44772 6 6 6Z"
        fill="currentColor"
      />
      <path
        d="M9 6V18"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  ) : (
    // Unpinned icon for desktop
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
    >
      <path
        d="M6 4C4.34315 4 3 5.34315 3 7V17C3 18.6569 4.34315 20 6 20H18C19.6569 20 21 18.6569 21 17V7C21 5.34315 19.6569 4 18 4H6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M9 6V18"
        stroke="currentColor"
        strokeWidth="1.5"
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
      text: "configuration",
      path: "/configuration",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
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
    <nav className={`h-screen flex flex-col pl-4 sm:pl-12 transition-smooth ${
      isExpanded ? "pr-8 sm:pr-16" : "pr-2 sm:pr-4"
    }`}>
      {/* Top section - contains everything that should align at top */}
      <div className="pt-4 sm:pt-12 flex-shrink-0">
        {/* Branding - visible when expanded */}
        <div className={`transition-smooth ${
          isExpanded ? "opacity-100 mb-12" : "opacity-0 pointer-events-none h-0 overflow-hidden mb-0"
        }`}>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary tracking-tight">BIND</span>
            <span className="text-xs text-secondary font-light tracking-wide">Management</span>
          </div>
        </div>

        {/* Active icon - visible when collapsed */}
        {options.map((item) => {
          const isActive = location === item.text;
          if (!isActive) return null;

          return (
            <div
              key={item.text}
              className={`transition-smooth ${
                isExpanded ? "opacity-0 pointer-events-none h-0 overflow-hidden" : "opacity-100"
              }`}
            >
              <a
                className="flex items-center group text-shadow-nav text-primary font-bold"
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
        <ul className={`flex flex-col text-base gap-6 items-start transition-smooth ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none h-0 overflow-hidden"
        }`} key={"primary nav"}>
          {options.map((item) => {
            const isActive = location === item.text;

            return (
              <li key={item.text}>
                <a
                  className={`flex items-center group text-shadow-nav text-primary ${
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
        <div className={`transition-smooth ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none w-0 overflow-hidden"
        }`} style={{
          transitionDelay: isExpanded ? '150ms' : '0ms'
        }}>
          <button
            className="text-primary text-shadow-nav"
            onClick={onToggle}
            title={!isMdOrLarger ? "Close sidebar" : (isPinned ? "Unpin sidebar" : "Pin sidebar")}
          >
            <div className="hover-scale">
              {toggleIcon}
            </div>
          </button>
        </div>

        {/* Theme Toggle - hidden when collapsed */}
        <div className={`transition-smooth ${
          isExpanded ? "opacity-100" : "opacity-0 pointer-events-none w-0 overflow-hidden"
        }`} style={{
          transitionDelay: isExpanded ? '150ms' : '0ms'
        }}>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default Sidebar;
