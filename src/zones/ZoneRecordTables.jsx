import React, { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import {
  Chevron_down,
  Chevron_up,
  PlusIcon,
  RefreshIcon,
} from "../components/Icons";
import {
  Accordion,
  AccordionTitle,
  AccordionContent,
  AccordionTable,
} from "../components/AccordionTable";
import axios from "axios";

export function RecordAccordionTable(props) {
  const [allRecords, setAllRecords] = useState(props.rows);

  const [selectedType, setselectedType] = useState(() => {
    const updatedSelectedType = {};
    if (props.rows !== null) {
      props.rows.forEach((record) => {
        updatedSelectedType[record.uuid] = record.type;
      });
    }
    return updatedSelectedType;
  });

  const [query, setQuery] = useState(() => {
    const updatedQuery = {};
    if (props.rows !== null) {
      props.rows.forEach((record) => {
        updatedQuery[record.uuid] = "";
      });
    }
    return updatedQuery;
  });
  const { refresh, setRefresh } = props;

  const headers = {
    Host: "w-4/12",
    Content: "w-5/12 px-2",
    Type: "w-1/12 px-2",
    TTL: "w-1/12 px-2",
  };

  const addNewRecord = () => {
    setAllRecords((prevRecord) => {
      const newRecord = {
        uuid: "new",
        type: "A",
        host: "",
        content: "",
        deleted_at: 0,
        staging: true,
        add_ptr: false,
        ttl: 3600,
      };
      return [newRecord, ...prevRecord];
    });

    setselectedType((prevSelectedType) => {
      const updatedSelectedType = { ...prevSelectedType };
      updatedSelectedType["new"] = "A";
      return updatedSelectedType;
    });

    setQuery((prevQuery) => {
      const updatedQuery = { ...prevQuery };
      updatedQuery["new"] = "";
      return updatedQuery;
    });
  };

  const recordsTypes = ["A", "AAAA", "CNAME", "MX", "NS", "SOA", "TXT", "PTR"];

  function recordsTypeComboBox(record) {
    const filteredType =
      query[record.uuid] === ""
        ? recordsTypes
        : recordsTypes.filter((recordsType) => {
            return recordsType
              .toLowerCase()
              .includes(query[record.uuid].toLowerCase());
          });

    return (
      <Combobox
        value={selectedType[record.uuid]}
        onChange={(choice) => {
          setselectedType((prevSelectedType) => {
            const updatedSelectedType = { ...prevSelectedType };
            updatedSelectedType[record.uuid] = choice;
            return updatedSelectedType;
          });
        }}
        // id={record.uuid + "type"}
        name={record.uuid + "type"}
      >
        <div class="flex flex-row w-full px-3 pr-1 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 sm:text-sm sm:leading-6">
          <Combobox.Input
            onChange={(event) => {
              setQuery((prevQuery) => {
                const updatedQuery = { ...prevQuery };
                updatedQuery[record.uuid] = event.target.value;
                return updatedQuery;
              });
            }}
            displayValue={(recordType) => recordType}
            class="w-full outline-none font-mono"
            name={record.uuid + "type"}
            id={record.uuid + "type"}
          />
          <Combobox.Button className="scale-75">
            <Chevron_down />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="h-0"
          enterTo="h-32"
          leave="transition ease-in-out duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => {
            setQuery((prevQuery) => {
              const updatedQuery = { ...prevQuery };
              updatedQuery[record.uuid] = "";
              return updatedQuery;
            });
          }}
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
        type: formData.get(record.uuid + "type"),
        host: formData.get(record.uuid + "host"),
        content: formData.get(record.uuid + "content"),
        ttl: parseInt(formData.get(record.uuid + "ttl")),
        add_ptr: formData.get(record.uuid + "add_ptr") === "on",
      };

      if (record.uuid === "new") {
        try {
          const response = await axios.post(
            "http://10.2.1.15:8090/api/v1/zones/" + props.zoneId + "/records",
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

        // delete record with new uuid
        setAllRecords((prevRecord) => {
          return prevRecord.filter((rec) => rec.uuid !== "new");
        });
      } else {
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
      }
      // wait 300ms before refresh
      await new Promise((resolve) => setTimeout(resolve, 300));
      setRefresh(Math.floor(Date.now() / 1000));
      setAllRecords(props.rows);
    };

    const handleDelete = async (uuid) => {
      try {
        const response = await axios.delete(
          "http://10.2.1.15:8090/api/v1/zones/" +
            props.zoneId +
            "/records/" +
            uuid,
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRefresh(Math.floor(Date.now() / 1000));
    };

    return (
      <>
        <form onSubmit={(e) => handleSubmit(e, record)} class="px-3">
          <div class="flex p-2 place-content-between">
            <div class="flex flex-col w-[10%]">
              <label for={record.uuid + "type"} class="p-1 text-sm">
                Type:
              </label>
              {recordsTypeComboBox(record)}
            </div>
            <div class="flex flex-col w-[30%]">
              <label for={record.uuid + "host"} class="p-1 text-sm">
                Hostname:
              </label>
              <input
                type="text"
                name={record.uuid + "host"}
                id={record.uuid + "host"}
                defaultValue={record.host}
                placeholder="ubuntu-prod-01.oci"
                required
                class="font-mono block px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex flex-col w-[45%]">
              <label for={record.uuid + "content"} class="p-1 text-sm">
                Content:
              </label>
              <textarea
                type="text"
                name={record.uuid + "content"}
                id={record.uuid + "content"}
                defaultValue={record.content}
                placeholder="89.0.142.86"
                required
                class="font-mono w-full h-[36px] min-h-9 block px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none resize-y sm:text-sm sm:leading-6"
              />
            </div>
            <div class="flex flex-col w-[10%]">
              <label for={record.uuid + "ttl"} class="p-1 text-sm">
                TTL:
              </label>
              <input
                type="number"
                step="1"
                pattern="\d+"
                name={record.uuid + "ttl"}
                id={record.uuid + "ttl"}
                defaultValue={record.ttl}
                placeholder="3600"
                required
                class="font-mono w-full block px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          {(selectedType[record.uuid] === "A" ||
            selectedType[record.uuid] === "AAAA") && (
            <div class="flex flex-row items-center pl-2">
              <input
                type="checkbox"
                name={record.uuid + "add_ptr"}
                id={record.uuid + "add_ptr"}
                defaultChecked={record.add_ptr}
                class="w-4 h-4 checked:bg-gray-800 border-gray-900"
              />
              <label for={record.uuid + "add_ptr"} class="p-1 text-sm">
                Add Reverse DNS (PTR)
              </label>
            </div>
          )}
          <div class="flex flex-row p-2 pb-3 place-content-between">
            <div
              onClick={(e) => handleDelete(record.uuid)}
              class="rounded-md outline outline-[1px] outline-[#b92424] px-2.5 py-1.5 text-sm text-[#b92424] shadow-gb2 hover:shadow-gba2 hover:text-white hover:bg-[#b92424] ease-in-out duration-300 active:scale-95 w-[86px] h-[32px] text-center cursor-pointer"
            >
              Delete
            </div>
            <button
              type="submit"
              class="rounded-md bg-[#373737] px-4 py-2 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 active:scale-95 place-self-end"
            >
              Submit
            </button>
          </div>
        </form>
        <p class="absolute left-28 bottom-4 text-center text-gray-500 text-[12px] border-none">
          {record.uuid !== "new" ? `UUID: ${record.uuid}` : ""}
        </p>
      </>
    );
  };

  return (
    <div class="flex flex-col">
      <div class="flex flex-row p-2 pb-3">
        <div class="flex flex-row w-[30%] items-center">
          <label for="host" class="z-10 relative left-3 text-sm w-0">
            Search:{" "}
          </label>
          <input
            type="text"
            name="host"
            id="host"
            class="z-0 block pl-[64px] pr-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none sm:text-sm sm:leading-6"
          />
        </div>
        <button
          class={
            "rounded-md bg-[#373737] ml-auto mx-4 px-1.5 py-1 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 justify-self-end"
          }
          onClick={() => setRefresh(Math.floor(Date.now() / 1000))}
        >
          <RefreshIcon additionalClass="scale-75" />
        </button>
        <button
          class={
            "rounded-md bg-[#373737] px-1.5 py-1 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 justify-self-end"
          }
          onClick={addNewRecord}
        >
          <PlusIcon additionalClass="scale-75" />
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
        <div class="ml-auto px-4 opacity-0">
          <Chevron_down />
        </div>
      </div>
      <div class="outline outline-1 outline-gray-200 translate-y-[1px] overflow-x-auto overflow-y-clip">
        {allRecords != null &&
          allRecords.map((record) => (
            <Accordion
              additionalClass={`${
                record.staging
                  ? record.deleted_at == 0
                    ? record.created_at == record.modified_at
                      ? "bg-green-200"
                      : "bg-slate-200"
                    : "bg-red-200"
                  : ""
              }`}
              key={record.uuid + "accordion"}
            >
              {record.uuid != "new" ? (
                <AccordionTitle>
                  {Object.entries(headers).map(([header, className]) => (
                    <div
                      key={record.uuid + header}
                      class={`font-mono ${className}`}
                    >
                      {record[header.toLowerCase()]}
                    </div>
                  ))}
                </AccordionTitle>
              ) : (
                <AccordionTitle>
                  <p>New Record</p>
                </AccordionTitle>
              )}
              <AccordionContent>{recordForm(record)}</AccordionContent>
            </Accordion>
          ))}
      </div>
    </div>
  );
}

export function SimpleRecordAccordionTable(props) {
  const [query, setQuery] = useState(() => {
    const updatedQuery = {};
    props.rows.forEach((record) => {
      updatedQuery[record.uuid] = "";
    });
    return updatedQuery;
  });
  const { refresh, setRefresh } = props;

  const headers = {
    Host: "w-4/12",
    Content: "w-5/12 px-2",
    Type: "w-1/12 px-2",
    TTL: "w-1/12 px-2",
  };

  return (
    <div class="flex flex-col">
      <div class="flex flex-row p-2 pb-3">
        <div class="flex flex-row w-[30%] items-center">
          <label for="host" class="z-10 relative left-3 text-sm w-0">
            Search:{" "}
          </label>
          <input
            type="text"
            name="host"
            id="host"
            class="z-0 block pl-[64px] pr-2 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 ease-in-out duration-300 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 outline-none sm:text-sm sm:leading-6"
          />
        </div>
        <button
          class={
            "rounded-md bg-[#373737] ml-auto mx-4 px-1.5 py-1 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 justify-self-end"
          }
          onClick={() => setRefresh(Math.floor(Date.now() / 1000))}
        >
          <RefreshIcon additionalClass="scale-75" />
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
        <div class="ml-auto px-4 opacity-0">
          <Chevron_down />
        </div>
      </div>
      <div class="outline outline-1 outline-gray-200 translate-y-[1px] overflow-x-auto overflow-y-clip">
        {props.rows.map((record) => (
          <Accordion
            additionalClass={`${
              record.staging
                ? record.deleted_at == 0
                  ? record.created_at == record.modified_at
                    ? "bg-green-200"
                    : "bg-slate-200"
                  : "bg-red-200"
                : ""
            }`}
            key={record.uuid}
            disableExpand={true}
          >
            {
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
            }
            <AccordionContent key={record.uuid}></AccordionContent>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
export default AccordionTable;
