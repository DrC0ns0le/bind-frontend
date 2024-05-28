import React, { useState, useEffect } from "react";
import Frame from "./components/Frame";
import { useParams } from "react-router-dom";
import axios from "axios";
import { SimpleRecordAccordionTable } from "./zones/ZoneRecordTables";
import { SpinningCog } from "./components/Icons";

function Apply() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([true, true, false]);
  const [error, setError] = useState(["", "", ""]);
  const [refresh, setRefresh] = useState(Math.floor(Date.now() / 1000));

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
    // set loading
    updateLoading(0, true);
    // send post request to backend
    try {
      const response = await axios.post(
        "http://10.2.1.15:8090/api/v1/staging",
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

  useEffect(() => {
    async function fetchStaging() {
      try {
        const response = await axios.get(
          "http://10.2.1.15:8090/api/v1/staging",
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
          "http://10.2.1.15:8090/api/v1/render",
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

    fetchStaging();
    fetchRender();
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

  if (loading[2]) {
    return (
      <Frame location="apply">
        <h1 class="text-6xl sm:text-8xl font-black tracking-tight">Apply</h1>
        <p class="text-2xl mt-4">Applying changes, please wait...</p>
        <div class="flex flex-col items-center justify-center h-1/2">
          {SpinningCog()}
        </div>
      </Frame>
    );
  }

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
            {"There's " +
              data[0].records.length +
              " change(s) ready to be applied."}
          </p>
        ) : (
          <p class="text-2xl mt-4">All changes have been applied.</p>
        )}
      </div>

      <div class="flex-wrap gap-4 mt-12 min-w-[540px]">
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
