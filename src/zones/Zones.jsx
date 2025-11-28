import React, { useState, useEffect } from "react";
import axios from "axios";
import Frame from "../components/Frame";
import BigButton1 from "../components/Buttons";
import { SpinningCog } from "../components/Icons";
import { PageHeading, Subheading } from "../components/Typography";

const apiUrl = import.meta.env.VITE_API_URL;

function Zones() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(apiUrl + "api/v1/zones", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const zoneClickHandler = (option) => {
    window.location.href = "/zone/" + option;
  };

  return (
    <Frame location="zones">
      <div>
        <PageHeading>Zones</PageHeading>
        <Subheading>Select a zone:</Subheading>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap items-center md:items-stretch gap-4 mt-12">
        {loading ? (
          <div className="flex w-full flex-row justify-center scale-150 mt-8">
            {SpinningCog()}
          </div>
        ) : error ? (
          <p>Error! {error.message}</p>
        ) : (
          data.data.map((option) => (
            <BigButton1
              key={option.uuid}
              option={option.uuid}
              value={option.name}
              onClick={zoneClickHandler}
            />
          ))
        )}
      </div>
    </Frame>
  );
}

export default Zones;
