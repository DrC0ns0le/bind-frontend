import React, { useState, useEffect } from "react";
import axios from "axios";
import Frame from "../components/Frame";
import BigButton1 from "../components/Buttons";
import { spinningCog } from "../components/Icons";

function Zones() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const spinningCog = (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      height="2em"
      width="2em"
      class="animate-spin"
    >
      <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
    </svg>
  );

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://10.2.1.15:8090/api/v1/zones", {
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
        <h1 class="text-6xl sm:text-8xl font-black tracking-tight">Zones</h1>
        <p class="text-2xl mt-4">Select a zone:</p>
      </div>
      <div class="flex-wrap gap-4 mt-12">
        <div>
          {loading ? (
            <div class="flex justify-center scale-150 mt-32">{spinningCog}</div>
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
      </div>
    </Frame>
  );
}

export default Zones;
