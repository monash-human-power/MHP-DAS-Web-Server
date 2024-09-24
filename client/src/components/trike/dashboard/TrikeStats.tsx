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
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>
      </div>

      {/** STINT DATA */}
      <div>
        <h2 className={styles.subtitle}>Stint Data</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>
      </div>

      {/** RACE DETAILS */}
      <div>
        <h2 className={styles.subtitle}>Race Details</h2>
      </div>

      <div className={styles.currentStintContainer}>
        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>

        <div className={styles.liveDataItem}>
          <LiveData value="300" unit="km/h" desc="Live Speed:" />
        </div>
      </div>
    </div>
  );
}
