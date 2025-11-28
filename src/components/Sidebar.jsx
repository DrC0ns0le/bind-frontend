import React from "react";

function Sidebar(props) {
  const { location } = props;
  const options = [
    { text: "home", path: "/" },
    { text: "zones", path: "/zones" },
    { text: "global", path: "/global" },
    { text: "apply", path: "/apply" },
  ];

  return (
    <nav className="h-screen flex justify-end items-center">
      <ul className="flex flex-col text-lg gap-6 text-center" key={"primary nav"}>
        {options.map((item) => (
          <li key={item.text}>
            <a
              className={`hover:drop-shadow-4xl md:text-xl transition-smooth drop-shadow-ps1 capitalize active:text-lg ${
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
    </nav>
  );
}

export default Sidebar;
