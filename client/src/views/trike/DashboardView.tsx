import React from 'react';

import TrikeLocationMap from 'components/trike/dashboard/TrikeLocationMap';

import { Col, Row } from 'react-bootstrap';

import styles from './DashboardView.module.css';
import { TrikeSpeedDistanceChart } from '../../components/trike/charts/TrikeSpeedDistanceChart';

/**
 * Dashboard view component
 *
 * @returns Component
 */
export default function DashboardView(): JSX.Element {
  return (
    <Row className={styles.contentContainer}>
      <Col lg={6} className={styles.content}>
        <div className={styles.bigGraph}>
          <TrikeSpeedDistanceChart />
        </div>
        <div className={styles.bigGraph}>
          <TrikeSpeedDistanceChart />
        </div>
      </Col>
      <Col lg={6} className={styles.content}>
        <div className={styles.bigGraph}>
          <TrikeLocationMap />
        </div>
      </Col>
    </Row>
  );
}
