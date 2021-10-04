import React from 'react';
import { Accordion, Button, Card, Col, Table } from 'react-bootstrap';

import OnlineStatusPill from 'components/common/OnlineStatusPill';
import { WMStatus as WMStatusT } from 'types/data';
import { isOnline } from 'utils/data';

export type WMStatusProps = WMStatusT;

/**
 * Status for Wireless Modules
 *
 * @param props Props
 * @returns component
 */
export default function WMStatus(props: WMStatusProps) {
  const { moduleName, online } = props;

  const statusPill = (
    <span>
      <b>{moduleName}</b> <OnlineStatusPill isOnline={online} />
    </span>
  );

  /**
   * convert Camel Case words to sentence case
   *
   * @param str - camel case string
   * @returns string in sentence format
   */
  function convertToTitleCase(str: String) {
    let title = str.toLowerCase();
    if (title === 'co2' || title === 'gps' || title === 'pdop') {
      return title.toUpperCase();
    }
    const result = title.replace(/([A-Z])/g, ' $1');
    const final = result.charAt(0).toUpperCase() + result.slice(1);
    return final;
  }

  /**
   * extract data from JSON objects and present them on client side so its user friendly
   *
   * @param type -  type of the data
   * @param data - data JSON received from the mqtt broker
   * @returns JSON-string
   */
  function extractData(type: string, data: any) {
    interface strMap {
      [key: string]: string | undefined;
    }
    interface numMap2 {
      [key: string]: number;
    }

    const units: strMap = {
      speed: 'km/h',
      satellites: '',
      pdop: '',
      latitude: '°N',
      longitude: '°E',
      altitude: 'm',
      course: '°',
      datetime: '',
      temperature: '°C',
      humidity: '%',
      steeringAngle: '°',
      co2: 'ppm',
      power: 'W',
      cadence: 'rpm',
      heartRate: 'bpm',
      reedVelocity: 'km/h',
      reedDistance: 'km',
    };

    const decimals: numMap2 = {
      speed: 1,
      satellites: 0,
      pdop: 2,
      latitude: 5,
      longitude: 5,
      altitude: 1,
      course: 1,
      temperature: 1,
      humidity: 0,
      steeringAngle: 1,
      co2: 0,
      power: 0,
      cadence: 0,
      heartRate: 0,
      reedVelocity: 1,
      reedDistance: 0,
      x: 2,
      y: 2,
      z: 2,
    };

    /**
     * receives a value and it unit and format them appropriately
     *
     * @param name
     * @param value
     * @param unit
     * @returns string containing hte value and its unit
     */
    function formatValue(name: string, value: any, unit: any) {
      let displayValue;
      let val = value;
      if (val !== null && val !== undefined) {
        if (name === 'Date' || name === 'Time') {
          displayValue =
            name === 'Date' ? value.substring(0, 10) : value.substring(11, 19);
        } else {
          const dec = decimals[name];
          if (unit === 'km') {
            val /= 1000;
          } else if (unit === 'km/h') {
            val *= 3.6;
          }
          displayValue = Math.floor(val * 10 ** dec) / 10 ** dec;
        }
      } else {
        displayValue = '-';
      }
      const displayUnit = unit ? ` ${unit}` : '';

      return `${displayValue}${displayUnit}`;
    }

    let output = <></>;

    if (type === 'accelerometer') {
      const accRows: any[] = [];
      Object.entries(data).forEach((arr) => {
        accRows.push({ name: arr[0], value: arr[1] });
      });

      output = (
        <Table borderless>
          <tbody>
            {accRows.map(({ name, value }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{convertToTitleCase(name)}</td>
                <td>
                  <div style={{ float: 'right' }}>
                    {formatValue(name, value, '')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else if (type === 'gyroscope') {
      const gyroRows: any[] = [];
      Object.entries(data).forEach((arr) => {
        gyroRows.push({ name: arr[0], value: arr[1] });
      });
      output = (
        <Table borderless>
          <tbody>
            {gyroRows.map(({ name, value }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{convertToTitleCase(name)}</td>
                <td>
                  <div style={{ float: 'right' }}>
                    {formatValue(name, value, '')}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    }
    // output = JSON.stringify(data);
    else if (type === 'gps') {
      const gpsRows: any[] = [];

      Object.entries(data).forEach((arr) => {
        if (arr[0] === 'datetime') {
          gpsRows.push({ name: 'Date', value: arr[1], unit: '' });
          gpsRows.push({ name: 'Time', value: arr[1], unit: '' });
        } else {
          gpsRows.push({ name: arr[0], value: arr[1], unit: units[arr[0]] });
        }
      });

      output = (
        <Table borderless>
          <tbody>
            {gpsRows.map(({ name, value, unit }) => (
              <tr
                key={name}
                style={{
                  width: '150px',
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  borderBottomStyle: 'solid',
                }}
              >
                <td>{convertToTitleCase(name)}</td>
                <td>
                  <div style={{ float: 'right' }}>
                    {formatValue(name, value, unit)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      output = (
        <div>{formatValue(type, JSON.stringify(data), units[type])}</div>
      );
    }
    return output;
  }

  let info = <> </>;

  if (isOnline(props)) {
    const { data, mqttAddress, batteryVoltage } = props;
    info = (
      <>
        {/* MQTT address */}
        <p style={{ fontSize: '0.75rem', color: 'gray' }}>{mqttAddress}</p>

        <Table hover>
          <tbody>
            {/* Battery Voltage */}
            <tr>
              <td>
                <strong>Battery Voltage</strong>
              </td>
              <td>{batteryVoltage.toFixed(2)} V</td>
            </tr>

            {/* Sensors List of Names */}
            <tr>
              <td>
                <strong>Sensors</strong>
              </td>
              <td>
                {data.map(({ type }) => convertToTitleCase(type)).join(', ')}
              </td>
            </tr>
          </tbody>
        </Table>

        {/* Sensor Data Toggle Section */}
        <Accordion className="mt-2">
          <Card>
            <Accordion.Toggle
              as={Button}
              variant="outline-success"
              eventKey="0"
            >
              Sensor Data
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <Table bordered hover>
                  <tbody>
                    {data.map(({ type, value }) => (
                      <tr key={`${moduleName} ${type}`}>
                        <td>
                          <strong>{convertToTitleCase(type)}</strong>
                        </td>
                        <td>
                          <div style={{ float: 'right' }}>
                            {extractData(type, value)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </>
    );
  }

  return (
    <Col md xl="12" className="my-2">
      {statusPill}

      {/* Only show more information if the camera is online */}
      {info}
    </Col>
  );
}
