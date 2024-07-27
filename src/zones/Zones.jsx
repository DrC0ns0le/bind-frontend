import React, { useState, useEffect } from "react";
import axios from "axios";
import Frame from "../components/Frame";
import BigButton1 from "../components/Buttons";
import { SpinningCog } from "../components/Icons";

function Zones() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://bind.internal.leejacksonz.com/api/v1/zones",
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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
            <div class="flex justify-center scale-150 mt-32">{SpinningCog}</div>
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
