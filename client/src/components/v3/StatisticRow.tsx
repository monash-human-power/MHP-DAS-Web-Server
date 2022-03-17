import { Sensor, useSensorData } from 'api/common/data';
import React, { useEffect, useState, useCallback } from 'react';
import { HeartRateRT, PowerRT, ReedVelocityRT } from 'types/data';
import { useChannelShaped } from 'api/common/socket';
import { SpeedPayload } from 'types/statistic';
import { roundNum } from 'utils/data';
import Statistic from './Statistic';
import styles from './StatisticRow.module.css';

/**
 * Statistic container using API for various stats.
 *
 * @returns Component
 */
export default function StatisticRow(): JSX.Element {
  // Should only be positive, abs max of currSpeed
  const [maxSpeed, setMaxSpeed] = useState<number | null>(null);

  // TODO: Multiple sensor data
  const currVel = useSensorData(3, Sensor.ReedVelocity, ReedVelocityRT);

  // Update max speed whenever the speed is updated
  useEffect(() => {
    // Update max speed as the greater of current velocity and previous max
    if (currVel) setMaxSpeed(Math.max(Math.abs(currVel), maxSpeed ?? 0));
    // Omit maxSpeed to avoid infinite render loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currVel]);

  // Previous Trap Speed (Achieved)
  // eslint-disable-next-line no-unused-vars
  const [prevTrapSpeed, setPrevTrapSpeed] = useState<number | null>(null);

  const handlePrevTrapSpeed = useCallback((payload: SpeedPayload) => {
    setPrevTrapSpeed(payload.speed);
  }, []);
  useChannelShaped('boost/prev_trap_speed', SpeedPayload, handlePrevTrapSpeed);

  // Next Trap Speed (Predicted)
  // eslint-disable-next-line no-unused-vars
  const [nextTrapSpeed, setNextTrapSpeed] = useState<number | null>(null);

  const handlePredictedMaxSpeed = useCallback((payload: SpeedPayload) => {
    setNextTrapSpeed(payload.speed);
  }, []);
  useChannelShaped(
    'boost/predicted_max_speed',
    SpeedPayload,
    handlePredictedMaxSpeed,
  );

  const power = useSensorData(4, Sensor.Power, PowerRT);

  const heartRate = useSensorData(4, Sensor.HeartRate, HeartRateRT);

  console.log(roundNum(100.0, 2));

  return (
    <div className={styles.statContainer}>
      <div className={styles.statSpeed}>
        <Statistic
          value={currVel ? roundNum(currVel, 2) : null}
          unit="km/h"
          desc="Current speed"
        />
      </div>
      <div className={styles.statSpeed}>
        <Statistic
          value={maxSpeed ? roundNum(maxSpeed, 2) : null}
          unit="km/h"
          desc="Max. speed"
        />
      </div>
      <div className={styles.statSpeed}>
        <Statistic
          value={prevTrapSpeed}
          unit="km/h"
          desc="Prev. trap speed (achieved)"
        />
      </div>
      <div className={styles.statSpeed}>
        <Statistic
          value={nextTrapSpeed}
          unit="km/h"
          desc="Next trap speed (predicted)"
        />
      </div>
      <div className={styles.line} />
      <div className={styles.statPower}>
        <Statistic
          value={power ? Math.round(power) : null}
          unit="W"
          desc="Power"
        />
      </div>
      <div className={styles.statHeartRate}>
        <Statistic
          value={heartRate ? Math.round(heartRate) : null}
          unit="bpm"
          desc="Heart rate"
        />
      </div>
    </div>
  );
}
