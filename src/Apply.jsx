import React, { useState, useEffect } from "react";
import Frame from "./components/Frame";
import { json, useParams } from "react-router-dom";
import axios from "axios";
import { SimpleRecordAccordionTable } from "./zones/ZoneRecordTables";
import { SpinningCog } from "./components/Icons";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { useNotification } from "./components/Alert";
import { PrimaryButton } from "./components/Buttons";
import { PageHeading, Subheading, SectionLabel } from "./components/Typography";

const apiUrl = import.meta.env.VITE_API_URL;

function Apply() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([true, true, false]);
  const [error, setError] = useState(["", "", "", ""]);
  const [refresh, setRefresh] = useState(Math.floor(Date.now() / 1000));
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
        apiUrl + "api/v1/staging",
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      addNotification("success", response.data.message);
      updateLoading(2, false);
      setRefresh(Math.floor(Date.now() / 1000));
    } catch (error) {
      console.log(error);
      addNotification(
        "error",
        "Failed to apply changes \n" + error.response.data.message
      );
      updateLoading(2, false);
      updateError(2, error);
      setRefresh(Math.floor(Date.now() / 1000));
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
        apiUrl + "api/v1/deploy",
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
      updateData(3, error.response.data.data);
      updateError(3, error);
    }
  };

  useEffect(() => {
    async function fetchStaging() {
      try {
        const response = await axios.get(apiUrl + "api/v1/staging", {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
        const response = await axios.get(apiUrl + "api/v1/render", {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
        const response = await axios.get(apiUrl + "api/v1/deploy", {
          headers: {
            "Content-Type": "application/json",
          },
        });
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
        <PageHeading>Apply</PageHeading>
        <Subheading>Loading...</Subheading>
        <div className="flex items-center justify-center h-1/2">
          {SpinningCog()}
        </div>
      </Frame>
    );
  }

  if (error[0]) {
    return (
      <Frame location="apply">
        <div className="flex items-center justify-center h-screen">
          <p>Error: {error[0].message}</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame location="apply">
      <div className="overflow-visible">
        <PageHeading>Apply</PageHeading>
        {data[0].records !== null ? (
          <Subheading>
            {"There's " +
              data[0].records.length +
              (data[0].records.length === 1 ? " record" : " records") +
              " in staging pending to be applied."}
          </Subheading>
        ) : data[2] ? (
          <Subheading>Ready to deploy the new configuration.</Subheading>
        ) : loading[2] ? (
          <Subheading>Committing changes, please wait...</Subheading>
        ) : loading[3] ? (
          <Subheading>Applying changes, please wait...</Subheading>
        ) : error[3] !== "" ? (
          <Subheading>Failed to apply changes.</Subheading>
        ) : (
          <Subheading>All changes have been applied.</Subheading>
        )}
      </div>

      <div className="flex-wrap gap-4 mt-12 min-w-[340px]">
        {/* Staging */}
        {loading[1] ? (
          <div className="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[0].records !== null ? (
          // if there are records, show commit UI
          <>
            <SectionLabel>RECORDS:</SectionLabel>
            <SimpleRecordAccordionTable
              rows={data[0].records}
              key="apply"
              refresh={refresh}
              setRefresh={setRefresh}
            />
            <div className="flex flex-row place-content-end">
              <PrimaryButton
                type="submit"
                className="mt-8 mr-2 place-self-end"
                onClick={(e) => {
                  e.preventDefault();
                  handleApply();
                }}
              >
                Apply
              </PrimaryButton>
            </div>
            <div className="flex flex-col place-content-end">
              <SectionLabel>PREVIEW:</SectionLabel>
              {Object.entries(data[1].before).map((file, content) => (
                <>
                  <p className="font-mono text-xs md:text-sm tracking-tighter font-black pb-4 pl-2 text-primary break-words">
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
                  <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
                </>
              ))}
            </div>
          </>
        ) : (
          <></>
        )}
        {/* Deployment */}
        {loading[2] ? (
          <div className="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[2] ? (
          <div>
            <div className="flex flex-row place-content-end">
              <PrimaryButton
                type="submit"
                className="mt-8 mr-2 place-self-end"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeploy();
                }}
              >
                Deploy
              </PrimaryButton>
            </div>
          </div>
        ) : (
          <></>
        )}
        {/* Deployment Outcome */}
        {loading[3] ? (
          <div className="flex justify-center h-1/2">{SpinningCog()}</div>
        ) : data[3] ? (
          <>
            <SectionLabel>Deployment Outcome:</SectionLabel>
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
