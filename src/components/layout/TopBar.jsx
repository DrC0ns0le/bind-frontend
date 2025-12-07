import React from "react";
import { ThemeToggle } from "./ThemeToggle";

function TopBar(props) {
  const { location } = props;
  const options = [
    { text: "home", path: "/" },
    { text: "zones", path: "/zones" },
    { text: "configuration", path: "/configuration" },
    { text: "apply", path: "/apply" },
  ];

  return (
    <nav className="w-full flex flex-row items-center justify-end gap-6 px-4 py-4 sm:px-16 xl:px-32 2xl:px-48">
      {/* Navigation Links */}
      <ul className="flex flex-row gap-6 sm:gap-8 text-base sm:text-lg" key={"primary nav"}>
        {options.map((item) => (
          <li key={item.text}>
            <a
              className={`text-shadow-nav uppercase active:scale-95 text-primary ${
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

      {/* Theme Toggle */}
      <ThemeToggle />
    </nav>
  );
}

export default TopBar;
