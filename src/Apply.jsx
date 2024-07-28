import React, { useState, useEffect } from "react";
import Frame from "./components/Frame";
import { json, useParams } from "react-router-dom";
import axios from "axios";
import { SimpleRecordAccordionTable } from "./zones/ZoneRecordTables";
import { SpinningCog } from "./components/Icons";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";

function Apply() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([true, true, false]);
  const [error, setError] = useState(["", "", ""]);
  const [refresh, setRefresh] = useState(Math.floor(Date.now() / 1000));
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

  const updateData = (key, data) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      updatedData[key] = data;
      return updatedData;
    });
  };

  const updateLoading = (key, loading) => {
    setLoading((prevLoading) => {
      const updatedLoading = { ...prevLoading };
      updatedLoading[key] = loading;
      return updatedLoading;
    });
  };

  const updateError = (key, error) => {
    setError((prevError) => {
      const updatedError = { ...prevError };
      updatedError[key] = error;
      return updatedError;
    });
  };

  const handleApply = async () => {
    // clear data[0].records
    updateData(0, { records: null });
    // set loading
    updateLoading(2, true);
    // send post request to backend
    try {
      const response = await axios.post(
        "https://bind.internal.leejacksonz.com/api/v1/staging",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      updateLoading(2, false);
      setRefresh(Math.floor(Date.now() / 1000));
    } catch (error) {
      console.log(error);
      updateLoading(2, false);
      updateError(2, error);
    }
  };

  const handleDeploy = async () => {
    // clear data[0].records
    updateData(0, { records: null });
    // set data[2] = false
    updateData(2, false);
    // set loading
    updateLoading(3, true);
    // send post request to backend
    try {
      const response = await axios.post(
        "https://bind.internal.leejacksonz.com/api/v1/deploy",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      updateLoading(3, false);
      updateData(3, response.data.data);
    } catch (error) {
      console.log(error);
      updateLoading(3, false);
      updateError(3, error);
    }
  };

  useEffect(() => {
    async function fetchStaging() {
      try {
        const response = await axios.get(
          "https://bind.internal.leejacksonz.com/api/v1/staging",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        updateData(0, response.data.data);
        updateLoading(0, false);
      } catch (error) {
        updateError(0, error);
        updateLoading(0, false);
      }
    }

    async function fetchRender() {
      updateLoading(1, true);
      try {
        const response = await axios.get(
          "https://bind.internal.leejacksonz.com/api/v1/render",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        updateData(1, response.data.data);
        updateLoading(1, false);
      } catch (error) {
        updateError(1, error);
        updateLoading(1, false);
      }
    }

    async function fetchDeploy() {
      updateLoading(2, true);
      try {
        const response = await axios.get(
          "https://bind.internal.leejacksonz.com/api/v1/deploy",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        updateData(2, response.data.data);
        updateLoading(2, false);
      } catch (error) {
        updateError(2, error);
        updateLoading(2, false);
      }
    }

    fetchStaging();
    fetchRender();
    fetchDeploy();
  }, [refresh]);

  if (loading[0]) {
    return (
      <Frame location="apply">
        <div class="flex items-center justify-center h-1/2">
          {SpinningCog()}
        </div>
      </Frame>
    );
  }

  // if (loading[2]) {
  //   return (
  //     <Frame location="apply">
  //       <h1 class="text-6xl sm:text-8xl font-black tracking-tight">Apply</h1>
  //       <p class="text-2xl mt-4">Applying changes, please wait...</p>
  //       <div class="flex flex-col items-center justify-center h-1/2">
  //         {SpinningCog()}
  //       </div>
  //     </Frame>
  //   );
  // }

  if (error[0]) {
    return (
      <Frame location="apply">
        <div class="flex items-center justify-center h-screen">
          <p>Error: {error[0].message}</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame location="apply">
      <div class="overflow-visible">
        {/* <p class="text-xl font-black tracking-tight">APPLY</p>
        <h1 class="text-3xl sm:text-8xl sm:h-28 font-black tracking-tight text-wrap overflow-scroll"></h1> */}
        <h1 class="text-6xl sm:text-8xl font-black tracking-tight">Apply</h1>
        {data[0].records !== null ? (
          <p class="text-2xl mt-4">
            {"There is " +
              data[0].records.length +
              (data[0].records.length === 1 ? " record" : " records") +
              " in staging pending to be applied."}
          </p>
        ) : data[2] ? (
          <p class="text-2xl mt-4">Ready to deploy the new configuration.</p>
        ) : loading[2] ? (
          <p class="text-2xl mt-4">Committing changes, please wait...</p>
        ) : loading[3] ? (
          <p class="text-2xl mt-4">Applying changes, please wait...</p>
        ) : (
          <p class="text-2xl mt-4">All changes have been applied.</p>
        )}
      </div>

      <div class="flex-wrap gap-4 mt-12 min-w-[340px]">
        {/* Staging */}
        {loading[1] ? (
          <div class="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[0].records !== null ? (
          <>
            <p class="font-mono text-xl font-black p-2 pl-2 text-[#343434] tracking-tight">
              RECORDS:
            </p>
            <SimpleRecordAccordionTable
              rows={data[0].records}
              key="apply"
              refresh={refresh}
              setRefresh={setRefresh}
            />
            <div class="flex flex-row place-content-end">
              <button
                type="submit"
                class="rounded-md bg-[#373737] mt-8 mr-2 px-4 py-2 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 active:scale-95 place-self-end"
                onClick={(e) => {
                  e.preventDefault();
                  handleApply();
                }}
              >
                Apply
              </button>
            </div>
            <div class="flex flex-col place-content-end">
              <p class="font-mono text-xl font-black p-2 pl-2 text-[#343434] tracking-tight">
                PREVIEW:
              </p>
              {Object.entries(data[1].before).map((file, content) => (
                <>
                  <p class="font-mono text-xs md:text-sm tracking-tighter font-black pb-4 pl-2 text-[#343434] break-words">
                    {file[0]}
                  </p>

                  <DiffEditor
                    theme="vs-light"
                    height="400px"
                    language="json"
                    key={file}
                    original={data[1].before[file[0]]}
                    modified={data[1].after[file[0]]}
                    options={{
                      readOnly: true,
                      renderSideBySide: isLargeScreen,
                    }}
                  />
                  <hr class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
                </>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
        {/* Deployment */}
        {loading[2] ? (
          <div class="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[2] ? (
          <div>
            <div class="flex flex-row place-content-end">
              <button
                type="submit"
                class="rounded-md bg-[#373737] mt-8 mr-2 px-4 py-2 text-sm font-semibold text-white shadow-gb2 hover:shadow-gba2 hover:bg-[#343434] ease-in-out duration-300 active:scale-95 place-self-end"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeploy();
                }}
              >
                Deploy
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* Deployment Outcome */}
        {loading[3] ? (
          <div class="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[3] ? (
          <>
            <p class="font-mono text-xl font-black p-2 pl-2 text-[#343434] tracking-tight">
              Deployment Outcome:
            </p>
            <Editor
              theme="vs-light"
              height="400px"
              language="json"
              value={data[3]}
              options={{
                readOnly: true,
              }}
            />
          </>
        ) : (
          <></>
        )}
      </div>
      {/* Button for submit */}
    </Frame>
  );
}

export default Apply;
