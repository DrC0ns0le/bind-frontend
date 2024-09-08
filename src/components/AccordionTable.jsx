import React, { useState, Fragment } from "react";
import { Chevron_down, Chevron_up } from "../components/Icons";

export function Accordion(props) {
  const [open, setOpen] = useState(false);
  const { children, additionalClass, disableExpand } = props;
  return (
    <>
      <div
        class={
          "flex flex-row cursor-pointer border-y-[0.5px] border-gray-200 " +
          additionalClass +
          (open ? " md:border-y-[1px]" : " md:border-none")
        }
        onClick={() => setOpen(!open)}
      >
        <div
          class={`flex flex-col md:flex-row md:items-center p-4 pr-1 md:p-[5px] md:px-4 hover:font-semibold ease-in-out duration-200 w-full ${
            open ? "font-semibold " : ""
          }`}
        >
          {children[0]}
        </div>
        {disableExpand ? null : (
          <div
            class={`ml-auto md:px-4 sm:py-0 duration-500 self-center mr-2 md:mr-0 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Chevron_down />
          </div>
        )}
      </div>
      {disableExpand ? null : (
        <div
          class={`w-full transition-all overflow-hidden ease-in-out duration-[500ms] border-gray-200" ${
            open ? "md:border-b-[1px] max-h-[1000px]" : "max-h-0 "
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
