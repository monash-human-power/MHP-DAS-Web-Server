import { LatLngTuple } from 'leaflet';
import React from 'react';
import {
  AttributionControl,
  CircleMarker,
  Map,
  Polyline,
  ScaleControl,
  TileLayer,
} from 'react-leaflet';

import styles from 'components/common/charts/LocationMap.module.css';
import LeafletCenterControl from 'components/v2/LeafletCenterControl';
import { LTSPToTuple } from 'components/trike/dashboard/AnimatedLocationMap';

import 'leaflet/dist/leaflet.css';

// const MHP_WORKSHOP_LOCATION = [-37.908756, 145.13404];
const CASEY_FIELDS_LOCATION: LatLngTuple = [-38.126945, 145.314126];

export interface LocationTimeSeriesPoint {
  /** GPS latitude */
  lat: number;
  /** GPS longitude */
  long: number;
}

export interface LocationMapProps {
  /** GPS location time series */
  series: LocationTimeSeriesPoint[];
}

/**
 * Location chart component
 *
 * @param props Props
 * @returns Component
 */
export default function LocationMap({ series }: LocationMapProps): JSX.Element {
  const bikeHistory: LatLngTuple[] = series.map(LTSPToTuple);

  const initialLocation = bikeHistory[0];
  const currentLocation = bikeHistory[bikeHistory.length - 1];

  // Keeps centre constant
  const center = CASEY_FIELDS_LOCATION;

  return (
    <Map
      center={center}
      zoom={16}
      attributionControl={false}
      className={styles.map}
    >
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // Alternate tile layer
        url="http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga"
      />

      {currentLocation ? (
        <CircleMarker
          center={currentLocation}
          radius={7}
          color="white"
          weight={2}
          fillColor="DodgerBlue"
          fillOpacity={1}
        />
      ) : null}

      {initialLocation ? (
        <CircleMarker
          center={initialLocation}
          radius={7}
          color="white"
          weight={2}
          fillColor="#0BDA51"
          fillOpacity={1}
        />
      ) : null}

      {/* Polyline draws all previous locations of the bike */}
      <Polyline positions={bikeHistory} color="DodgerBlue" weight={1} />
      <ScaleControl imperial={false} />
      <AttributionControl prefix={false} />
      <LeafletCenterControl center={center} />
    </Map>
  );
}
