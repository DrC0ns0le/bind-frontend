import React, { useState, useEffect, Fragment } from "react";
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
  TableHeader,
} from "../components/AccordionTable";
import { PrimaryButton, DangerButton, IconButton } from "../components/Buttons";
import { TextInput, NumberInput, TextArea } from "../components/FormInputs";
import axios from "axios";
import { useNotification } from "../components/Alert";

const apiUrl = import.meta.env.VITE_API_URL;

export function RecordAccordionTable(props) {
  const [allRecords, setAllRecords] = useState(props.rows);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  const addNotification = useNotification();

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    Type: "w-1/12",
    Host: "w-4/12",
    Content: "w-5/12",
    TTL: "w-1/12",
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
        <div className="flex flex-row w-full px-3 pr-1 rounded-md border-0 py-1.5 text-gray-900 shadow-gb2 hover:shadow-gba2 transition-smooth ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-800 md:text-sm md:leading-6">
          <Combobox.Input
            onChange={(event) => {
              setQuery((prevQuery) => {
                const updatedQuery = { ...prevQuery };
                updatedQuery[record.uuid] = event.target.value;
                return updatedQuery;
              });
            }}
            displayValue={(recordType) => recordType}
            className="w-full outline-none font-mono"
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
          <Combobox.Options className="font-mono cursor-pointer p-1 max-h-32 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-gb2 ring-1 ring-black ring-opacity-5 md:text-sm">
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
                    className={`p-1 pl-3 transition-smooth ${
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
            apiUrl + "api/v1/zones/" + props.zoneId + "/records",
            newRecord,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response.data);
          addNotification("success", response.data.message);
        } catch (error) {
          console.log(error);
          addNotification(
            "error",
            "Failed to create record \n" + error.response.data.message
          );
        }

        // delete record with new uuid
        setAllRecords((prevRecord) => {
          return prevRecord.filter((rec) => rec.uuid !== "new");
        });
      } else {
        try {
          const response = await axios.put(
            apiUrl + "api/v1/zones/" + props.zoneId + "/records/" + record.uuid,
            newRecord,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          console.log(response.data);
          addNotification("success", response.data.message);
        } catch (error) {
          console.log(error);
          addNotification(
            "error",
            "Failed to update record \n" + error.response.data.message
          );
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
          apiUrl + "api/v1/zones/" + props.zoneId + "/records/" + uuid,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response.data);
        addNotification("success", response.data.message);
      } catch (error) {
        console.log(error);
        addNotification("warning", "Failed to delete record \n" + error);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRefresh(Math.floor(Date.now() / 1000));
    };

    return (
      <>
        <form onSubmit={(e) => handleSubmit(e, record)} className="px-3">
          <div className="flex flex-col md:flex-row p-2 place-content-between">
            <div className="flex flex-col w-[30%] md:w-[10%]">
              <label
                htmlFor={record.uuid + "type"}
                className="p-1 text-sm pt-4 md:pt-1"
              >
                Type:
              </label>
              {recordsTypeComboBox(record)}
            </div>
            <div className="flex flex-col md:w-[30%]">
              <label
                htmlFor={record.uuid + "host"}
                className="p-1 text-sm pt-4 md:pt-1"
              >
                Hostname:
              </label>
              <TextInput
                name={record.uuid + "host"}
                id={record.uuid + "host"}
                defaultValue={record.host}
                placeholder="ubuntu-prod-01.oci"
                required
              />
            </div>
            <div className="flex flex-col md:w-[45%]">
              <label
                htmlFor={record.uuid + "content"}
                className="p-1 text-sm pt-4 md:pt-1"
              >
                Content:
              </label>
              <TextArea
                name={record.uuid + "content"}
                id={record.uuid + "content"}
                defaultValue={record.content}
                placeholder="89.0.142.86"
                required
                className="w-full h-[128px] touch:h-[128px] md:h-[36px] min-h-9 resize-y"
              />
            </div>
            <div className="flex flex-col w-[40%] md:w-[10%]">
              <label
                htmlFor={record.uuid + "ttl"}
                className="p-1 text-sm pt-4 md:pt-1"
              >
                TTL:
              </label>
              <NumberInput
                step="1"
                pattern="\d+"
                name={record.uuid + "ttl"}
                id={record.uuid + "ttl"}
                defaultValue={record.ttl}
                placeholder="3600"
                required
                className="w-full"
              />
            </div>
          </div>
          {(selectedType[record.uuid] === "A" ||
            selectedType[record.uuid] === "AAAA") && (
            <div className="flex flex-row items-center pl-2">
              <input
                type="checkbox"
                name={record.uuid + "add_ptr"}
                id={record.uuid + "add_ptr"}
                defaultChecked={record.add_ptr}
                className="w-4 h-4 checked:bg-gray-800 border-gray-900"
              />
              <label htmlFor={record.uuid + "add_ptr"} className="p-1 text-sm">
                Add Reverse DNS (PTR)
              </label>
            </div>
          )}
          <div className="flex flex-row p-2 pb-3 place-content-between">
            <DangerButton onClick={(e) => handleDelete(record.uuid)}>
              Delete
            </DangerButton>
            <p className="pl-2 md:pb-1 self-end text-gray-500 text-[12px] border-none grow ">
              {record.uuid !== "new" ? `UUID: ${record.uuid}` : ""}
            </p>
            <PrimaryButton type="submit" className="place-self-end">
              Submit
            </PrimaryButton>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row p-2 pb-3">
        <div className="flex flex-row w-[30%] items-center">
          <label htmlFor="host" className="z-10 relative left-3 text-sm w-0">
            Search:{" "}
          </label>
          <TextInput
            name="host"
            id="host"
            value={props.searchQuery}
            className="z-0 pl-[64px] pr-2"
            onChange={(e) => {
              props.setSearchQuery(e.target.value);
            }}
          />
        </div>
        <IconButton
          className="ml-auto mx-4 bg-primary text-white hover:bg-primary-hover shadow-gb2 hover:shadow-gba2"
          onClick={() => setRefresh(Math.floor(Date.now() / 1000))}
        >
          <RefreshIcon additionalClass="scale-75" />
        </IconButton>
        <IconButton
          className="bg-primary text-white hover:bg-primary-hover shadow-gb2 hover:shadow-gba2"
          onClick={addNewRecord}
        >
          <PlusIcon additionalClass="scale-75" />
        </IconButton>
      </div>
      {isLargeScreen ? (
        <TableHeader className="pr-[72px]">
          {Object.entries(headers).map(([header, className]) => (
            <div
              key={header}
              className={`${className} font-semibold font-mono tracking-tight text-md`}
            >
              {header}
            </div>
          ))}
        </TableHeader>
      ) : (
        <TableHeader>
          Zone Records
        </TableHeader>
      )}
      <div className="outline outline-1 outline-gray-200 translate-y-[1px] overflow-y-clip">
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
              {isLargeScreen ? (
                record.uuid != "new" ? (
                  <AccordionTitle key={record.uuid + "title"}>
                    {Object.entries(headers).map(([header, className]) => (
                      <div
                        key={record.uuid + header + "key"}
                        className={`font-mono ${className}`}
                      >
                        {record[header.toLowerCase()]}
                      </div>
                    ))}
                  </AccordionTitle>
                ) : (
                  <AccordionTitle>
                    <p>New Record</p>
                  </AccordionTitle>
                )
              ) : record.uuid != "new" ? (
                <AccordionTitle key={record.uuid + "title"}>
                  {Object.entries(headers).map(([header, _]) => (
                    <div className="flex flex-row" key={record.uuid + header}>
                      <div
                        key={record.uuid + header + "key"}
                        className={`font-mono min-w-20 text-left pr-2 tracking-tighter`}
                      >
                        {header + ":"}
                      </div>
                      <div
                        key={record.uuid + header + "value"}
                        className={`font-mono text-wrap break-all tracking-tight`}
                      >
                        {record[header.toLowerCase()]}
                      </div>
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
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 768);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const headers = {
    Host: "w-4/12",
    Content: "w-5/12 px-2",
    Type: "w-1/12 px-2",
    TTL: "w-1/12 px-2",
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row p-2 pb-3">
        <div className="flex flex-row w-[30%] items-center">
          <label htmlFor="host" className="z-10 relative left-3 text-sm w-0">
            Search:{" "}
          </label>
          <TextInput
            name="host"
            id="host"
            className="z-0 pl-[64px] pr-2"
          />
        </div>
        <IconButton
          className="ml-auto mx-4 bg-primary text-white hover:bg-primary-hover shadow-gb2 hover:shadow-gba2"
          onClick={() => setRefresh(Math.floor(Date.now() / 1000))}
        >
          <RefreshIcon additionalClass="scale-75" />
        </IconButton>
      </div>
      {isLargeScreen ? (
        <TableHeader>
          {Object.entries(headers).map(([header, className]) => (
            <div
              key={header}
              className={`${className} font-semibold font-mono tracking-tight text-md`}
            >
              {header}
            </div>
          ))}
        </TableHeader>
      ) : (
        <TableHeader>
          Staging Records
        </TableHeader>
      )}
      {
        <div className="outline outline-1 outline-gray-200 translate-y-[1px] overflow-x-auto overflow-y-clip">
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
                  {Object.entries(headers).map(([header, className]) =>
                    isLargeScreen ? (
                      <div
                        key={record[header.toLowerCase]}
                        className={`font-mono ${className}`}
                      >
                        {record[header.toLowerCase()]}
                      </div>
                    ) : (
                      <>
                        <div
                          key={record.uuid + header + "header"}
                          className={`font-semibold uppercase pt-2 text-xs tracking-wide`}
                        >
                          {header}
                        </div>
                        <div
                          key={record.uuid + header + "value"}
                          className={`font-mono text-wrap break-all tracking-tight`}
                        >
                          {record[header.toLowerCase()]}
                        </div>
                      </>
                    )
                  )}
                </AccordionTitle>
              }
              <AccordionContent key={record.uuid}></AccordionContent>
            </Accordion>
          ))}
        </div>
      }
    </div>
  );
}
export default AccordionTable;
