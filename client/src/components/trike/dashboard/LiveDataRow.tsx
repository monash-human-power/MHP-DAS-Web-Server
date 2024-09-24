import React, { useState, useEffect } from 'react';
import { LatLngTuple } from 'leaflet';
import styles from './LiveDataRow.module.css';
import LiveData from './LiveData';

/*
// For testing display
interface LiveDataRow {
  watts: number;
  speed: number;
  stintLaps: string;
  rider: string;
  estSpeed: number;
  estPitTime: string;
}

interface LiveDataProps {
  data: LiveDataRow;
}

export default function LiveDataRow({ data }: LiveDataProps) {
*/

// getting power data from json file TESTING PURPOSES

const powerData: LatLngTuple[] = require('../CaseyPowerData.json');

export default function LiveDataRow(): JSX.Element {
  /* Testing LIVE display using JSON data */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPower, setCurrentPower] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < powerData.length) {
        const [, power] = powerData[currentIndex]; // Get ONLY power from parsed data
        setCurrentPower(power); // set current 'live' value
        setCurrentIndex((prevIndex) => prevIndex + 1); // next value
      } else {
        clearInterval(interval); // functional reset
      }
    }, 200); // update value (can modify timing)

    return () => clearInterval(interval); // clear
  }, [currentIndex]);
  /* End Live data testing */

  /* Button Counter testing */

  const [LapNum, setLapNum] = useState(0);

  const incLap = () => {
    setLapNum((prevLapNum) => prevLapNum + 1); // Use prevLapNum for the most up-to-date value
  };

  const decLap = () => {
    if (LapNum !== 0) {
      setLapNum((prevLapNum) => prevLapNum - 1); // Use prevLapNum for the most up-to-date value
    }
  };

  /* End Button testing */

  /* Local Time / Date Testing */
  const date = new Date();
  const showTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  /* End time testing */

  return (
    <div>
      <div>
        <h3 className={styles.title}>CURRENT STINT</h3>
        <h2 className={styles.title}>Local Time: {showTime}</h2>
      </div>

      <div>
        <h2 className={styles.subtitle}>Live Data</h2>
      </div>

      {/** LIVE DATA */}
      <div className={styles.currentStintContainer}>
        {currentPower !== null && (
          <div className={styles.liveDataItem}>
            <LiveData
              value={currentPower} // Show power value or "No data"
              unit="W"
              desc="Live Watts:"
            />
          </div>
        )}

        <div className={styles.liveDataItem}>
          <LiveData value={currentPower} unit="km/h" desc="Live Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value={LapNum} unit="" desc="Stint Laps:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="" unit="" desc="Rider:" />
          <select className={styles.pitButton}>
            <option value="James">James</option>
            <option value="Casey">Casey</option>
            <option value="Matt">Matt</option>
          </select>
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="50" unit="km/h" desc="Est. Speed" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="30" unit="m" desc="Est. Pit Time" />
          <div className={styles.buttonContainer}>
            <button
              style={{ color: '#73c977' }}
              onClick={incLap}
              className={styles.pitButton}
              type="button"
            >
              + 1 LAP
            </button>
            <button
              style={{ color: '#e02626' }}
              onClick={decLap}
              className={styles.pitButton}
              type="button"
            >
              - 1 LAP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
