import React from 'react';
import styles from './LiveDataRow.module.css';
import LiveData from './LiveData';

export default function TrikeStatsRow(): JSX.Element {
  return (
    <div>
      {/** LAP DATA */}
      <div>
        <h2 className={styles.subtitle}>Lap Data</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Last Lap Time:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Last Lap Avg Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Last Lap Avg Watts:" />
        </div>
      </div>

      {/** STINT DATA */}
      <div>
        <h2 className={styles.subtitle}>Stint Data</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="to be finished" unit="km/h" desc="Elapsed Time:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Avg Spd:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Distance Covered:" />
        </div>
      </div>

      {/** RACE DETAILS */}
      <div>
        <h2 className={styles.subtitle}>Race Details</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Elapsed Time:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Avg Spd:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Laps Done:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Distance Covered:" />
        </div>
      </div>
    </div>
  );
}
