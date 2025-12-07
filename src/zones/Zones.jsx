/**
 * Zones list page - Refactored to use service layer
 * Displays all DNS zones and allows navigation to zone details
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Frame from '../components/Frame';
import BigButton1 from '../components/ui';
import { SpinningCog } from '../components/Icons';
import { PageHeading, Subheading } from '../components/Typography';
import { zoneService } from '../api/services/zoneService';
import { getUserFriendlyError } from '../utils/errorHandlers';

function Zones() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const zones = await zoneService.getZones();
        setData(zones);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const zoneClickHandler = (zoneId) => {
    navigate(`/zone/${zoneId}`);
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
          <div className="text-primary text-center w-full">
            <p className="text-danger font-semibold mb-2">Error loading zones</p>
            <p className="text-sm">{getUserFriendlyError(error)}</p>
          </div>
        ) : (
          data?.map((zone) => (
            <BigButton1
              key={zone.uuid}
              option={zone.uuid}
              value={zone.name}
              onClick={zoneClickHandler}
            />
          ))
        )}
      </div>
    </Frame>
  );
}

export default Zones;
