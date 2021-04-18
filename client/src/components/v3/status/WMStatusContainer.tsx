import React from 'react';
import { Card, Row } from 'react-bootstrap';

import WMStatus, { WMStatusProps } from 'components/v3/status/WMStatus';

/**
 * Container for Wireless Module Statuses
 *
 * @returns Component
 */
export default function WMStatusContainer() {
  // TODO: Link API

  const front: WMStatusProps = {
    moduleName: 'Front WM',
    online: null,
  };

  const middle: WMStatusProps = {
    moduleName: 'Middle WM',
    online: null,
  };

  const back: WMStatusProps = {
    moduleName: 'Back WM',
    online: null,
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Wireless Modules</Card.Title>
        <Row>
          {/* Front WM Status */}
          <WMStatus {...front} />

          {/* Middle WM Status */}
          <WMStatus {...middle} />

          {/* Back WM Status */}
          <WMStatus {...back} />
        </Row>
      </Card.Body>
    </Card>
  );
}
