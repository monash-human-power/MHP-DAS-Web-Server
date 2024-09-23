import React, { useEffect, useState } from 'react';

import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import LocationMap, {
  LocationTimeSeriesPoint,
} from 'components/common/charts/LocationMap';
import { GPSRT } from 'types/data';

export const TrikeMapKey = 'trike-dashboard-location-map-chart-data';
export const TrikeZoomKey = 'trike-dashboard-location-map-zoom';

const caseyData: LatLngTuple[] = require('../CaseyLatLngTuple.json');

console.log(caseyData[5]);

/**
 * Checks if a given location is an object consisting of a valid latitude and longitude.
 *
 * @param location Location to check
 * @returns True if is valid, otherwise False
 */
function isValidLocation(location: LocationTimeSeriesPoint): boolean {
  return (
    Number.isFinite(location.lat) &&
    location.lat >= -90 &&
    location.lat <= 90 &&
    Number.isFinite(location.long) &&
    location.long >= -180 &&
    location.long <= 180 &&
    (location.lat !== 0 || location.long !== 0)
  );
}

/**
 * Map showing the location of the bike
 *
 * @property props Props
 * @returns Component
 */
export default function TrikeLocationMap(): JSX.Element {
  const storedData: string | null = sessionStorage.getItem(TrikeMapKey);

  console.log('storedData', storedData);

  const [locationHistory, setStateLocationHistory] = useState<
    LocationTimeSeriesPoint[]
  >(storedData ? JSON.parse(storedData) : []);

  const setLocationHistory = (data: LocationTimeSeriesPoint[]) => {
    sessionStorage.setItem(TrikeMapKey, JSON.stringify(data));
    setStateLocationHistory(data);
  };

  // Reset on start
  const reset = () => setLocationHistory([]);
  // TODO: need to change this reset topic
  useChannel('wireless_module-3-start', reset);

  // Extract location info from GPS
  const GPS = useSensorData(3, Sensor.GPS, GPSRT);

  useEffect(() => {
    if (GPS) {
      const location = { lat: GPS.latitude, long: GPS.longitude };

      if (isValidLocation(location))
        setLocationHistory([...locationHistory, location]);
    }
    // Omit locationHistory to prevent infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GPS]);

  console.log('locationHistory', locationHistory);
  return <LocationMap series={locationHistory} />;
}
