import React from 'react';

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
      help me test this
      <Col className={styles.content}>Help me test more</Col>
    </Row>
  );
}
