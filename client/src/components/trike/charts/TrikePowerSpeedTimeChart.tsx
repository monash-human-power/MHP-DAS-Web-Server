import React, { useEffect, useRef, useState } from 'react';

import { Sensor, useSensorData } from 'api/common/data';
import { useChannel } from 'api/common/socket';
import PowerSpeedTimeChart from 'components/common/charts/PowerSpeedTimeChart';
import { ChartPoint } from 'types/chart';
import { AntDistanceRT, AntSpeedRT } from 'types/data';

export const TrikePSTChartKey = 'trike-dashboard-power-speed-time-chart-data';

/**
 * Passes trike data to the speed distance chart component
 *
 * @returns Component
 */
export function TrikePowerSpeedTimeChart() {
  const storedData = sessionStorage.getItem(TrikePSTChartKey);

  // Used to store the data points
  const [data, setStateData] = useState<ChartPoint[]>(
    storedData ? JSON.parse(storedData) : [],
  );
  const maxSpeed = useRef(data.reduce((acc, { y }) => Math.max(acc, y), 0));

  // Store data for session
  const setData = (newData: ChartPoint[]) => {
    sessionStorage.setItem(TrikePSTChartKey, JSON.stringify(newData));
    setStateData(newData);
  };

  // Reset when start message received
  const reset = () => setData([]);
  useChannel('wireless_module-4-start', reset);

  // Speed
  const speed = useSensorData(4, Sensor.AntSpeed, AntSpeedRT);
  const distance = useSensorData(4, Sensor.AntDistance, AntDistanceRT);

  // Update data whenever the point is updated
  useEffect(() => {
    // Add new data point
    if (
      speed &&
      distance && // Non null
      // New distance measurement
      distance !== data[data.length - 1]?.x
    ) {
      const speedKmh = speed * 3.6;
      maxSpeed.current = Math.max(maxSpeed.current, speedKmh);
      setData([...data, { x: distance, y: speedKmh }]);
    }
    // Omit data in deps as otherwise there would be an infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  return (
    <PowerSpeedTimeChart
      // Maximum of data set
      data={data}
      data2={data}
      max={maxSpeed.current}
      max2={maxSpeed.current}
    />
  );
}
