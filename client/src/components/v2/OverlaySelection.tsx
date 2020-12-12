import { getPrettyDeviceName, OverlaysHook } from 'api/v2/camera';
import RadioSelector from 'components/RadioSelector';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';

export interface OverlaySelectionProps extends OverlaysHook {
  /** Camera screen */
  device: 'primary' | 'secondary'
}

/**
 * Camera settings for a display
 *
 * @param props Props
 * @returns Component
 */
export default function OverlaySelection({
  device,
  overlays: controls,
  setActiveOverlay
}: OverlaySelectionProps): JSX.Element {
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const name = getPrettyDeviceName(device);

  // On overlay data load, set selected to existing value
  useEffect(() => {
    setSelectedOverlay(controls?.active);
  }, [controls]);

  const handleSave = useCallback(
    (event) => {
      event.preventDefault();
      if (selectedOverlay) {
        setActiveOverlay(selectedOverlay);
      }
    },
    [selectedOverlay, setActiveOverlay],
  );

  return (
    <Card>
      <Card.Body>
        <Card.Title>{`${name} display`}</Card.Title>
        {controls ? (
          <RadioSelector
            options={controls.overlays}
            value={selectedOverlay}
            onChange={setSelectedOverlay}
          />
        ) : (
            <Card.Subtitle>Waiting for response...</Card.Subtitle>
          )}
      </Card.Body>
      <Card.Footer>
        <Card.Link href="#" onClick={handleSave}>
          Save
        </Card.Link>
      </Card.Footer>
    </Card>
  );
}
