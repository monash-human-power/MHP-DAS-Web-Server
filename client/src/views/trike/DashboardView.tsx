import React from 'react';

import TrikeLocationMap from 'components/trike/dashboard/TrikeLocationMap';

import { Container, Col, Row } from 'react-bootstrap';

import styles from './DashboardView.module.css';
import { TrikePowerSpeedTimeChart } from '../../components/trike/charts/TrikePowerSpeedTimeChart';

/**
 * Dashboard view component
 *
 * @returns Component
 */
export default function DashboardView(): JSX.Element {
  return (
    <Container fluid>
      <Row className={styles.contentContainer}>
        <Col
          xs={{ span: 12, order: 1 }}
          lg={{ span: 6, order: 1 }}
          className={styles.statContainer}
        >
          Statistics Here
        </Col>
        <Col xs={{ span: 12, order: 3 }} lg={{ span: 6, order: 2 }}>
          <div className={styles.graph}>
            <TrikePowerSpeedTimeChart />
          </div>
        </Col>
        <Col
          xs={{ span: 12, order: 2 }}
          lg={{ span: 6, order: 3 }}
          className={styles.statContainer}
        >
          Statistics Here
        </Col>
        <Col xs={{ span: 12, order: 4 }} lg={{ span: 6, order: 4 }}>
          <div className={styles.bigGraph}>
            <TrikeLocationMap />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
