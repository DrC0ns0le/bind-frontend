import React, { useState, useEffect } from "react";
import Frame from "../components/Frame";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RecordAccordionTable } from "./ZoneRecordTables";
import { SpinningCog } from "../components/Icons";

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
        const response = await axios.get(
          "http://10.2.1.15:8090/api/v1/zones/" + zoneId,
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

    async function fetchRecords() {
      updateLoading(1, true);
      try {
        const response = await axios.get(
          "http://10.2.1.15:8090/api/v1/zones/" + zoneId + "/records",
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
        </div>
      </Frame>
    );
  }

  return (
    <Frame location="zones">
      <div class="overflow-visible">
        <p class="text-xl font-black tracking-tight">ZONE</p>
        <h1 class="text-3xl sm:text-8xl sm:h-28 font-black tracking-tight text-wrap overflow-scroll">
          {data[0].name}
        </h1>
      </div>

      <div class="flex-wrap gap-4 mt-12 min-w-[540px]">
        <p class="font-mono text-xl font-black p-2 pl-2 text-[#343434] tracking-tight">
          ZONE DETAILS:
        </p>
        <div class="flex flex-col gap-2"></div>
      </div>

      <div class="flex-wrap gap-4 mt-12 min-w-[540px]">
        {loading[1] ? (
          <div class="flex justify-center">{SpinningCog()}</div>
        ) : (
          <>
            <p class="font-mono text-xl font-black p-2 pl-2 text-[#343434] tracking-tight">
              ZONE RECORDS:
            </p>
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
