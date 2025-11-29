import React from "react";
import { useNavigate } from "react-router-dom";

function Breadcrumb({ items, location, isExpanded, onToggle, isMobile }) {
  const navigate = useNavigate();

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
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      )
    },
  ];

  const activeItem = options.find((item) => item.text === location);

  return (
    <nav
      className={`flex items-center gap-2 text-sm mb-4 h-6 dark:text-gray-400 text-gray-600 transition-smooth ${
        isMobile && !isExpanded ? 'cursor-pointer' : ''
      }`}
      onClick={(e) => {
        if (isMobile && !isExpanded) {
          // Only trigger if clicking on the nav itself, not on interactive children
          const target = e.target;
          if (target.tagName !== 'BUTTON' && target.tagName !== 'A') {
            onToggle();
          }
        }
      }}
    >
      {/* Active icon on mobile when collapsed */}
      {isMobile && !isExpanded && activeItem && (
        <button
          onClick={onToggle}
          className="flex items-center text-gray-900 dark:text-gray-300 hover:drop-shadow-4xl transition-smooth drop-shadow-ps1 dark:drop-shadow-dark-ps1 active:scale-95 font-bold"
          title={activeItem.text}
        >
          <span className="flex-shrink-0 [&>svg]:stroke-[2]">
            {activeItem.icon}
          </span>
        </button>
      )}

      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          )}
          {item.path ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(item.path);
              }}
              className="hover:text-gray-900 dark:hover:text-gray-200 transition-smooth uppercase"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 dark:text-gray-300 font-medium uppercase transition-smooth">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumb;
