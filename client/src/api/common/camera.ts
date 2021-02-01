import { emit, useChannelShaped } from 'api/common/socket';
import { useCallback, useEffect, useState } from 'react';
import {
  Array,
  Boolean,
  Literal,
  Number,
  Record,
  Runtype,
  Static,
  String,
  Union
} from 'runtypes';
import { capitalise, formatBytes, formatMinutes } from 'utils/string';

const CameraDevice = Union(Literal('primary'), Literal('secondary'));
type CameraDevice = Static<typeof CameraDevice>;

const CameraConfig = Record({
  /** Device that the camera has been configured to be */
  device: CameraDevice,
  /** Bike that the camera is configured to be on */
  bike: String,
  /** List of available overlays */
  overlays: Array(String),
  /** Name of currently active overlay */
  activeOverlay: String,
});
type CameraConfig = Static<typeof CameraConfig>;

export interface CameraConfigT {
  /** Config defined by CameraConfig */
  config: CameraConfig | null,
  /** Set the active overlay */
  setActiveOverlay: (activeOverlay: string) => void
}

/**
 * Use a list of camera overlays
 *
 * @param device Camera screen
 * @returns Status of overlays and function to set active overlay.
 */
export function useCameraConfig(device: CameraDevice) {
  const [config, setConfig] = useState<CameraConfig | null>(null);

  const handleData = useCallback(
    (newConfig: CameraConfig) => {
      // Received config is not necessarily for the requested device
      if (newConfig.device === device) {
        setConfig(newConfig);
      }
    },
    [device],
  );
  useChannelShaped('push-overlays', CameraConfig, handleData);

  useEffect(() => {
    emit('get-overlays');
  }, [device]);

  const setActiveOverlay = useCallback(
    (activeOverlay: string) => {
      emit(
        'set-overlays',
        JSON.stringify({
          [device]: activeOverlay,
        }),
      );
    },
    [device],
  );

  return { config, setActiveOverlay };
}

/**
 * Sends a message to the rider's camera overlay.
 *
 * @param message Message to send to rider
 */
export function sendMessage(message: string) {
  if (!message) return;

  emit('send-message', message);
}

/**
 * Send a message to server to start recording video
 */
export function startRecording() {
  emit('start-camera-recording');
}

/**
 * Send a message to server to stop recording video
 */
export function stopRecording() {
  emit('stop-camera-recording');
}

const CameraRecordingOffPayload = Record({
  status: Literal('off'),
  /** Remaining disk space available for recording, in bytes */
  diskSpaceRemaining: Number,
});
const CameraRecordingOnPayload = Record({
  status: Literal('recording'),
  /** Current duration of recording in minutes */
  recordingMinutes: Number,
  /** Path to video file being recorded */
  recordingFile: String,
  diskSpaceRemaining: Number,
});
const CameraRecordingErrorPayload = Record({
  status: Literal('error'),
  diskSpaceRemaining: Number,
  /** Description of error that has occurred */
  error: String,
});
const CameraRecordingStatusPayload = Union(
  CameraRecordingOffPayload,
  CameraRecordingOnPayload,
  CameraRecordingErrorPayload,
);
type CameraRecordingStatusPayload = Static<typeof CameraRecordingStatusPayload>;

export interface CameraRecordingStatusItem {
  /** Display name of the status item e.g. "Disk Space Remaining" */
  name: string;
  /** Value of the status item e.g. "1.2 GiB" */
  value: string;
}

/**
 * Parse the recording payload into an object and format the values
 *
 * Payload structure is defined in the 'V3 MQTT Topics' page on Notion.
 * Topic is /v3/camera/recording/status/<primary/>secondary>.
 *
 * @param payload Payload from MQTT message, parsed
 * @returns Formatted payload
 */
export function formatRecordingPayload(payload: CameraRecordingStatusPayload | null) {
  if (!payload) return null;

  // Format data always present regardless of status
  const commonData: CameraRecordingStatusItem[] = [
    { name: 'Status', value: capitalise(payload.status) },
    {
      name: 'Disk space remaining',
      value: formatBytes(payload.diskSpaceRemaining),
    },
  ];

  // Format data that is dependent on status
  const formatter = CameraRecordingStatusPayload.match(
    () => [],
    (onPayload) => [
      {
        name: 'Recording duration',
        value: formatMinutes(onPayload.recordingMinutes),
      },
      { name: 'Recording file', value: onPayload.recordingFile },
    ],
    (errorPayload) => [{ name: 'Error', value: errorPayload.error }],
  );

  return commonData.concat(formatter(payload));
}

/**
 * Initiate receiving status payloads
 *
 * @param subComponent The sub component to init for (e.g. recording, video feed)
 * @param device Device
 */
function initStatus(subComponent: string, device?: CameraDevice) {
  const path = ['camera', subComponent];
  if (device) path.push(device);
  emit(`get-status-payload`, path);
}

/**
 * Makes the device name pretty.
 *
 * Hardcoded for efficiency. If you don't like it, complain to Angus Trau :).
 *
 * @param device Device
 * @returns  Prettied device name
 */
export function getPrettyDeviceName(device: CameraDevice) {
  return device === 'primary' ? 'Primary' : 'Secondary';
}

/**
 * `T` Type of the socket.io payload
 * `U` Type to be returned by the handler
 */
interface StatusPayloadOptions<T, U> {
  /** Initial value for the payload */
  initValue: T | null;
  /** Handler for updating payload */
  payloadHandler?: (
    setter: React.Dispatch<React.SetStateAction<T | null>>,
    newPayload: T | null,
    device: CameraDevice,
  ) => T | void;
  /** Handler for return value */
  returnHandler: (payload: T | null, device?: CameraDevice) => U | null;
}

/**
 * Create hooks for getting payloads
 *
 * @param sub Subcomponent
 * @param shape Shape of received payloads
 * @param opts Options
 * @returns Hook for getting a payload
 */
function createStatusPayloadHook<T, U>(
  sub: string,
  shape: Runtype<T>,
  {
    initValue = null,
    payloadHandler = (
      setter: React.Dispatch<React.SetStateAction<T | null>>,
      newPayload: T | null,
    ) => setter(newPayload ?? initValue),
    returnHandler,
  }: StatusPayloadOptions<T, U>,
) {
  return function _hook(device: CameraDevice) {
    // Only run init once per render
    useEffect(() => {
      initStatus(sub, device);
    }, [device]);

    const [payload, setPayload] = useState(initValue);
    useChannelShaped(`status-camera-${sub}`, shape, (newPayload: T) =>
      payloadHandler(setPayload, newPayload, device),
    );

    return returnHandler(payload, device);
  };
}

/**
 * Returns the last status payload published
 *
 * @param device Device
 * @returns Recording status
 */
export const useCameraRecordingStatus = createStatusPayloadHook(
  'recording',
  CameraRecordingStatusPayload,
  {
    initValue: null,
    returnHandler: (payload) => formatRecordingPayload(payload)
  },
);

const VideoFeedStatus = Record({
  /** Whether video feed is on/off */
  online: Boolean,
});
export interface VideoFeedStatus {
  /** Whether video feed is on/off */
  online: boolean
}

/**
 * Returns the last received status of the video feeds from `/v3/camera/video_feed/status/<primary/secondary>`
 *
 * @returns A VideoFeedStatus for each device
 */
export const useVideoFeedStatus = createStatusPayloadHook(
  'video_feed',
  VideoFeedStatus,
  { initValue: null, returnHandler: (payload) => payload },
);

const CameraStatus = Record({
  /** Whether camera is connected / not connected */
  connected: Boolean,
});

/**
 * Returns the last received connection status of the camera client to the mqtt broker
 *
 * @param device Device
 * @returns Camera status
 */
export const useCameraStatus = (device: CameraDevice) =>
  createStatusPayloadHook(device, CameraStatus, {
    initValue: { connected: false },
    returnHandler: (payload) => payload,
  })(device);
