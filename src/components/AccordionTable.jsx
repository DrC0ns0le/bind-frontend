import React, { useState, Fragment } from "react";
import { Chevron_down, Chevron_up } from "../components/Icons";

export function Accordion(props) {
  const [open, setOpen] = useState(false);
  const { children, additionalClass, disableExpand } = props;
  return (
    <>
      <div class={"flex flex-row " + additionalClass}>
        <div
          class={`flex flex-col md:flex-row md:items-center p-1 px-3 md:px-4 hover:font-semibold border-gray-200 ease-in-out duration-200 cursor-pointer border-y-[0.5px] sm:border-none w-full ${
            open ? "font-semibold ease-in-out" : ""
          }`}
          onClick={() => setOpen(!open)}
        >
          {children[0]}
        </div>
        {disableExpand ? null : (
          <p
            class={`ml-auto sm:px-4 py-3 sm:py-0 duration-200 self-center ${
              open ? "rotate-180" : ""
            }`}
          >
            <Chevron_down />
          </p>
        )}
      </div>
      {disableExpand ? null : (
        <div
          class={`w-full translate-y-[1px] transition-all ${
            open ? "outline outline-1 outline-gray-200" : "hidden"
          }`}
        >
          {children[1]}
        </div>
      )}
    </>
  );
}

export function AccordionTitle(props) {
  const { children } = props;
  return <>{children}</>;
}

export function AccordionContent(props) {
  const { children } = props;
  return <>{children}</>;
}

export function AccordionTable(props) {
  const { headers, rows } = props;
  return (
    <div class="flex flex-col">
      <div class="flex flex-row flex-nowrap rounded-t-[8px] outline outline-1 outline-gray-200 py-2 px-4 ">
        {Object.entries(headers).map(([header, className]) => (
          <div key={header} class={`${className} font-semibold`}>
            {header}
          </div>
        ))}
        <div class="ml-auto px-4 opacity-0">
          <Chevron_down />
        </div>
      </div>
      <div class="outline outline-1 outline-gray-200 translate-y-[1px] break-words">
        {rows.map((record) => (
          <Accordion>
            <AccordionTitle>
              {Object.entries(headers).map(([header, className]) => (
                <div key={record[header.toLowerCase]} class={`${className}`}>
                  {record[header.toLowerCase()]}
                </div>
              ))}
            </AccordionTitle>
            <AccordionContent>
              <p class="p-2 pl-4">
                I have so much to do but so little time~! Will implement ASAP~
              </p>
            </AccordionContent>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default AccordionTable;
