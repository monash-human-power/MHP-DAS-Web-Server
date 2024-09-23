import React from 'react';
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

export default function LiveDataRow(): JSX.Element {
  return (
    <div>
      <div>
        <h3 className={styles.title}>CURRENT STINT</h3>
      </div>
      <div>
        <h2 className={styles.subtitle}>Live Data</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="500" unit="W" desc="Live Watts" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="50" unit="km/h" desc="Live Speed" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="10/15" unit="" desc="Stint Laps" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="James" unit="(rider)" desc="Rider" />
          <button className={styles.pitButton} type="button">
            PIT RIDER
          </button>
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="50" unit="km/h" desc="Est. Speed" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="30" unit="m" desc="Est. Pit Time" />
        </div>
      </div>
    </div>
  );
}
