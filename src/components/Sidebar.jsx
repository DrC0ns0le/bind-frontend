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
    <nav class="h-screen flex justify-end items-center">
      <ul
        class="flex flex-col text-lg gap-6 text-center px-4 basis-1/2"
        key={"primary nav"}
      >
        {options.map((item) => (
          <li key={item.text}>
            <a
              class={`hover:text-2xl hover:drop-shadow-4xl md:text-xl ease-in-out duration-300 drop-shadow-ps1 capitalize tracking-wide ${
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
