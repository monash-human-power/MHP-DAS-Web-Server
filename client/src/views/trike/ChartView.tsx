import React from 'react';

import { TrikeSpeedDistanceChart } from 'components/trike/charts/TrikeSpeedDistanceChart';

import { Col, Row } from 'react-bootstrap';

import styles from './DashboardView.module.css';

/**
 * Dashboard view component
 *
 * @returns Component
 */
export default function ChartView(): JSX.Element {
  return (
    <Row className={styles.contentContainer}>
      <Col className={styles.content}>
        <div className={styles.bigGraph}>
          <TrikeSpeedDistanceChart />
        </div>
      </Col>
    </Row>
  );
}
