import React, { useState, Fragment } from "react";
import { Chevron_down, Chevron_up } from "../components/Icons";

export function Accordion(props) {
  const [open, setOpen] = useState(false);
  const { children, additionalClass, disableExpand } = props;
  return (
    <>
      <div
        className={
          "flex flex-row cursor-pointer border-y-[0.5px] border-gray-200 " +
          additionalClass +
          (open ? " md:border-y-[1px]" : " md:border-none")
        }
        onClick={() => setOpen(!open)}
      >
        <div
          className={`flex flex-col md:flex-row md:items-center p-4 pr-1 md:p-[5px] md:px-4 hover:font-semibold transition-smooth w-full ${
            open ? "font-semibold " : ""
          }`}
        >
          {children[0]}
        </div>
        {disableExpand ? null : (
          <div
            className={`ml-auto md:px-4 sm:py-0 transition-smooth self-center mr-2 md:mr-0 ${
              open ? "rotate-180" : ""
            }`}
          >
            <Chevron_down />
          </div>
        )}
      </div>
      {disableExpand ? null : (
        <div
          className={`w-full transition-all overflow-hidden transition-smooth border-gray-200" ${
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

// Extracted TableHeader component for reusability
export function TableHeader({ children, className = "" }) {
  return (
    <div className={`flex flex-row flex-nowrap rounded-t-[8px] outline outline-1 outline-gray-200 py-2 px-4 ${className}`}>
      {children}
    </div>
  );
}

// Extracted TableRow component for consistent styling
export function TableRow({ children, className = "" }) {
  return (
    <div className={`flex flex-row items-center py-2 px-4 ${className}`}>
      {children}
    </div>
  );
}

export function AccordionTable(props) {
  const { headers, rows } = props;
  return (
    <div className="flex flex-col">
      <TableHeader>
        {Object.entries(headers).map(([header, className]) => (
          <div key={header} className={`${className} font-semibold`}>
            {header}
          </div>
        ))}
        <div className="ml-auto px-4 opacity-0">
          <Chevron_down />
        </div>
      </TableHeader>
      <div className="outline outline-1 outline-gray-200 translate-y-[1px] break-words">
        {rows.map((record) => (
          <Accordion key={record.id || record.name}>
            <AccordionTitle>
              {Object.entries(headers).map(([header, className]) => (
                <div key={record[header.toLowerCase]} className={`${className}`}>
                  {record[header.toLowerCase()]}
                </div>
              ))}
            </AccordionTitle>
            <AccordionContent>
              <p className="p-2 pl-4">
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
