import React, { useState, useEffect } from "react";
import Frame from "../components/Frame";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RecordAccordionTable } from "./ZoneRecordTables";
import { SpinningCog } from "../components/Icons";

const apiUrl = import.meta.env.VITE_API_URL;

function Zone() {
  const params = useParams();
  const zoneId = params.zone;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([true, true]);
  const [error, setError] = useState([false, false]);
  const [refresh, setRefresh] = useState(false);

  const updateData = (key, data) => {
    setData((prevData) => {
      const updatedData = { ...prevData };
      if (data) {
        updatedData[key] = data;
      } else {
        updatedData[key] = [];
      }
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

  useEffect(() => {
    async function fetchZone() {
      try {
        const response = await axios.get(apiUrl + "api/v1/zones/" + zoneId, {
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

    async function fetchRecords() {
      updateLoading(1, true);
      try {
        const response = await axios.get(
          apiUrl + "api/v1/zones/" + zoneId + "/records",
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

    fetchZone();
    fetchRecords();
  }, [refresh]);

  if (loading[0]) {
    return (
      <Frame location="zones">
        <div class="flex items-center justify-center h-screen">
          {SpinningCog()}
        </div>
      </Frame>
    );
  }

  if (error[0]) {
    return (
      <Frame location="zones">
        <div class="flex items-center justify-center h-screen">
          <p>Error: {error[0].message}</p>
          <p>---</p>
          <p>{error[0].response.data.message}</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame location="zones">
      <div>
        <p class="text-2xl font-black tracking-tight">ZONE</p>
        <h1 class="text-[80px] sm:text-8xl pb-4 font-black tracking-tight text-wrap overflow-scroll">
          {data[0].name}
        </h1>
      </div>

      {/* <div class="flex-wrap sm:gap-4 mt-4 min-w-[340px]">
        <p class="font-mono text-xl font-black p-2 pl-2 text-[#343434] tracking-tight">
          ZONE DETAILS:
        </p>
        <div class="flex flex-col gap-2"></div>
      </div>
      <hr class="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" /> */}
      <div class="flex-wrap sm:gap-4 mt-12 min-w-[340px]">
        <p class="font-mono text-xl font-black p-2 pl-2 text-[#343434] tracking-tight">
          ZONE RECORDS:
        </p>
        {loading[1] ? (
          <div class="flex justify-center">{SpinningCog()}</div>
        ) : error[1] ? (
          <div class="flex flex-col items-center justify-center pt-8">
            <p>Error: Failed to fetch records</p>
            <p class="p-2">---</p>
            <p>
              {error[1].response.status}: {error[1].response.data.message}
            </p>
          </div>
        ) : (
          <>
            <RecordAccordionTable
              rows={data[1]}
              key={zoneId}
              zoneId={zoneId}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </>
        )}
      </div>
    </Frame>
  );
}

export default Zone;
