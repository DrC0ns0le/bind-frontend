import React from "react";
import { ThemeToggle } from "./ThemeToggle";

function Sidebar(props) {
  const { location } = props;
  const options = [
    { text: "home", path: "/" },
    { text: "zones", path: "/zones" },
    { text: "global", path: "/global" },
    { text: "apply", path: "/apply" },
  ];

  return (
    <nav className="h-screen flex flex-col items-center py-8 pr-8">
      {/* Spacer to push nav to center */}
      <div className="flex-1"></div>

      {/* Navigation Links - Centered */}
      <ul className="flex flex-col text-lg gap-6 text-center" key={"primary nav"}>
        {options.map((item) => (
          <li key={item.text}>
            <a
              className={`hover:drop-shadow-4xl md:text-xl transition-smooth drop-shadow-ps1 dark:drop-shadow-dark-ps1 capitalize active:text-lg dark:text-gray-300 ${
                location === item.text ? "font-bold" : ""
              }`}
              key={item.text}
              href={item.path}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>

      {/* Spacer to push toggle to bottom */}
      <div className="flex-1"></div>

      {/* Theme Toggle - At Bottom */}
      <ThemeToggle />
    </nav>
  );
}

export default Sidebar;
