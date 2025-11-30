import React, { useState, useEffect, useCallback, useMemo } from "react";
import Frame from "../components/Frame";
import { useParams } from "react-router-dom";
import axios from "axios";
import { RecordAccordionTable } from "./ZoneRecordTables";
import { SpinningCog } from "../components/Icons";
import PaginationControls from "../components/PaginationControls";
import { PageHeading, SectionLabel } from "../components/Typography";
import _ from "lodash";

const apiUrl = window.ENV?.VITE_API_URL || import.meta.env.VITE_API_URL;

function Zone() {
  const params = useParams();
  const zoneId = params.zone;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([true, true]);
  const [error, setError] = useState([false, false]);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [prevSearchQuery, setPrevSearchQuery] = useState("");

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

  // Memoize fetchRecords to prevent recreation on every render
  const fetchRecords = useCallback(async () => {
    updateLoading(1, true);
    try {
      const response = await axios.get(
        `${apiUrl}api/v1/zones/${zoneId}/records?page=${currentPage}&search=${searchQuery}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      updateData(1, response.data.data);
      setPagination(response.data.data.pagination || null);
      updateLoading(1, false);
    } catch (error) {
      updateError(1, error);
      updateLoading(1, false);
    }
  }, [zoneId, currentPage, searchQuery]);

  // Create debounced version of fetchRecords
  const debouncedFetchRecords = useMemo(
    () => _.debounce(() => fetchRecords(), 500),
    [fetchRecords]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedFetchRecords.cancel();
    };
  }, [debouncedFetchRecords]);

  // Effect for fetching zone data
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

    fetchZone();
  }, [zoneId]);

  // Separate effect for fetching records
  useEffect(() => {
    // use debounced fetch
    if (searchQuery !== prevSearchQuery) {
      setPrevSearchQuery(searchQuery);
      debouncedFetchRecords();
    }
    // fetch immediately
    else {
      fetchRecords();
    }

    // Reset refresh flag after fetching
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh, searchQuery, currentPage, fetchRecords, debouncedFetchRecords]);

  const handlePageChange = (newPage, pageSize) => {
    setCurrentPage(newPage);
  };

  const breadcrumbs = [
    { label: "zones", path: "/zones" },
    { label: data[0]?.name || "...", path: null }
  ];

  if (loading[0]) {
    return (
      <Frame location="zones" breadcrumbs={[{ label: "zones", path: "/zones" }]}>
        <div className="flex items-center justify-center h-screen">
          {SpinningCog()}
        </div>
      </Frame>
    );
  }

  if (error[0]) {
    return (
      <Frame location="zones" breadcrumbs={[{ label: "zones", path: "/zones" }]}>
        <div className="flex items-center justify-center h-screen dark:text-gray-300">
          <p>Error: {error[0].message}</p>
          <p>---</p>
          <p>{error[0].response.data.message}</p>
        </div>
      </Frame>
    );
  }

  return (
    <Frame location="zones" breadcrumbs={breadcrumbs}>
      <div>
        <p className="text-2xl font-black tracking-tight dark:text-gray-300 transition-smooth">ZONE</p>
        <PageHeading className="text-[80px] pb-4 text-wrap overflow-scroll">
          {data[0]?.name}
        </PageHeading>
      </div>

      <div className="flex-wrap sm:gap-4 mt-12 min-w-[340px]">
        <SectionLabel>ZONE RECORDS:</SectionLabel>
        {loading[1] ? (
          <div className="flex justify-center">{SpinningCog()}</div>
        ) : error[1] ? (
          <div className="flex flex-col items-center justify-center pt-8 dark:text-gray-300">
            <p>Error: Failed to fetch records</p>
            <p className="p-2">---</p>
            <p>
              {error[1].response.status}: {error[1].response.data.message}
            </p>
          </div>
        ) : (
          <>
            <RecordAccordionTable
              rows={data[1]?.records || []}
              key={`${zoneId}-${currentPage}`}
              zoneId={zoneId}
              refresh={refresh}
              setRefresh={setRefresh}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            {pagination && (
              <div className="flex justify-center pt-4">
                <PaginationControls
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </Frame>
  );
}

export default Zone;
