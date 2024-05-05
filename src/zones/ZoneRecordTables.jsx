import React, { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { chevron_down, chevron_up, plusIcon } from "../components/Icons";
import {
  Accordion,
  AccordionTitle,
  AccordionContent,
  AccordionTable,
} from "../components/AccordionTable";
import axios from "axios";

export function RecordAccordionTable(props) {
  const { headers, rows, refresh, setRefresh } = props;

  const recordsTypes = ["A", "AAAA", "CNAME", "MX", "NS", "SOA", "TXT"];

  function recordsTypeComboBox(currentRecordType) {
    const [selectedType, setselectedType] = useState(currentRecordType);
    const [query, setQuery] = useState("");

    const filteredType =
      query === ""
        ? recordsTypes
        : recordsTypes.filter((recordsType) => {
            return recordsType.toLowerCase().includes(query.toLowerCase());
          });

    return (
      <Combobox value={selectedType} onChange={setselectedType} name="type">
        <div class="flex flex-row w-full px-3 pr-1 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6">
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(recordType) => recordType}
            class="w-full outline-none font-mono"
          />
          <Combobox.Button className="scale-75">{chevron_down}</Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="h-0"
          enterTo="h-32"
          leave="transition ease-in-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="font-mono cursor-pointer p-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-gb2 ring-1 ring-black ring-opacity-5 sm:text-sm">
            {filteredType.map((recordType) => (
              /* Use the `active` state to conditionally style the active option. */
              /* Use the `selected` state to conditionally style the selected option. */
              <Combobox.Option
                key={recordType}
                value={recordType}
                as={Fragment}
              >
                {({ active, selected }) => (
                  <li
                    className={`p-1 pl-3 ease-in-out duration-300 ${
                      active || selected
                        ? "font-bold text-black"
                        : "bg-white text-black"
                    }`}
                  >
                    {recordType}
                  </li>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Transition>
      </Combobox>
    );
  }

  const recordForm = (record) => {
    const handleSubmit = async (e, record) => {
      // this function send put request to backend
      e.preventDefault();
      const formData = new FormData(e.target);
      // create new objct and parse ttl to int
      const newRecord = {
        type: formData.get("type"),
        host: formData.get("host"),
        content: formData.get("content"),
        ttl: parseInt(formData.get("ttl")),
      };
      try {
        const response = await axios.put(
          "http://10.2.1.15:8090/api/v1/zones/" +
            props.zoneId +
            "/records/" +
            record.uuid,
          newRecord,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }

      setRefresh(!refresh);
    };

    return (
      <>
        <form onSubmit={(e) => handleSubmit(e, record)} class="px-3">
          <div class="flex p-2 place-content-between">
            <div class="flex flex-col w-[10%]">
              <label for="type" class="p-1 text-sm">
                Type:{" "}
              </label>
              {recordsTypeComboBox(record.type)}
            </div>
            <div class="flex flex-col w-[30%]">
              <label for="host" class="p-1 text-sm">
                Hostname:{" "}
              </label>
              <input
                type="text"
                name="host"
                id="host"
                defaultValue={record.host}
                placeholder="ubuntu-prod-01.oci"
                required
                class="font-mono block px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex flex-col w-[45%]">
              <label for="content" class="p-1 text-sm">
                Content:{" "}
              </label>
              <textarea
                type="text"
                name="content"
                id="content"
                defaultValue={record.content}
                placeholder="89.0.142.86"
                required
                class="font-mono w-full h-[36px] min-h-9 block px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none resize-y sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex flex-col w-[10%]">
              <label for="ttl" class="p-1 text-sm">
                TTL:{" "}
              </label>
              <input
                type="number"
                step="1"
                pattern="\d+"
                name="ttl"
                id="ttl"
                defaultValue={record.ttl}
                placeholder="3600"
                required
                class="font-mono w-full block px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div class="flex flex-row p-2 pb-3 place-content-between">
            <button
              type="submit"
              class="rounded-md outline outline-[1px] outline-[#b92424] px-2.5 py-1.5 text-sm text-[#b92424] shadow-gb2 hover:shadow-gba2 hover:text-white hover:bg-[#b92424] ease-in-out duration-300 w-[86px] h-[32px]"
            >
              Delete
            </button>
            <button
              type="submit"
              class="rounded-md bg-[#373737] px-4 py-2 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 place-self-end"
            >
              Submit
            </button>
          </div>
        </form>
        <p class="absolute left-28 bottom-4 text-center text-gray-500 text-[12px] border-none">
          UUID: {record.uuid}
        </p>
      </>
    );
  };

  return (
    <div class="flex flex-col">
      <div class="flex flex-row p-2 pb-3 place-content-between">
        <div class="flex flex-row w-[25%] items-center">
          <label for="host" class="absolute pl-3 text-sm">
            Search:{" "}
          </label>
          <input
            type="text"
            name="host"
            id="host"
            class="block pl-[64px] pr-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none sm:text-sm sm:leading-6"
          />
        </div>
        <button
          class={
            "rounded-md bg-[#373737] px-2.5 py-1 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 place-self-end"
          }
          onClick={setRefresh(false)}
        >
          +
        </button>
      </div>
      <div class="flex flex-row flex-nowrap rounded-t-[8px] outline outline-1 outline-gray-200 py-2 px-4 ">
        {Object.entries(headers).map(([header, className]) => (
          <div
            key={header}
            class={`${className} font-semibold font-mono tracking-tight text-md`}
          >
            {header}
          </div>
        ))}
        <div class="ml-auto px-4 opacity-0">{chevron_up}</div>
      </div>
      <div class="outline outline-1 outline-gray-200 translate-y-[1px] overflow-x-auto">
        {rows.map((record) => (
          <Accordion
            additionalClass={`${
              record.staging
                ? record.deleted_at == 0
                  ? "bg-green-200"
                  : "bg-red-200"
                : ""
            }`}
          >
            <AccordionTitle key={record.uuid}>
              {Object.entries(headers).map(([header, className]) => (
                <div
                  key={record[header.toLowerCase]}
                  class={`font-mono ${className}`}
                >
                  {record[header.toLowerCase()]}
                </div>
              ))}
            </AccordionTitle>
            <AccordionContent key={record.uuid}>
              {recordForm(record)}
            </AccordionContent>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
export default AccordionTable;
