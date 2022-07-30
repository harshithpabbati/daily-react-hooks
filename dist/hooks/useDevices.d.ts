declare type GeneralState = 'pending' | 'not-supported' | 'granted' | 'blocked' | 'in-use' | 'not-found';
declare type DeviceState = 'granted' | 'in-use';
export interface StatefulDevice {
    device: MediaDeviceInfo;
    selected: boolean;
    state: DeviceState;
}
/**
 * This hook allows access to information about the user's devices and their state.
 */
export declare const useDevices: () => {
    /**
     * A list of the user's camera (videoinput) devices. See [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) for more info.
     */
    cameras: StatefulDevice[];
    /**
     * The general state for camera access.
     */
    camState: GeneralState;
    /**
     * Indicates that there's an issue with camera devices.
     */
    hasCamError: boolean;
    /**
     * Indicates that there's an issue with microphone devices.
     */
    hasMicError: boolean;
    /**
     * A list of the user's microphone (audioinput) devices. See [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) for more info.
     */
    microphones: StatefulDevice[];
    /**
     * The general state for microphone access.
     */
    micState: GeneralState;
    /**
     * Refreshes the list of devices using [enumerateDevices](https://docs.daily.co/reference/daily-js/instance-methods/enumerate-devices).
     */
    refreshDevices: () => Promise<void>;
    /**
     * Allows to switch to the camera with the specified deviceId. Calls [setInputDevicesAsync](https://docs.daily.co/reference/daily-js/instance-methods/set-input-devices-async) internally.
     */
    setCamera: (deviceId: string) => Promise<void>;
    /**
     * Allows to switch to the microphone with the specified deviceId. Calls [setInputDevicesAsync](https://docs.daily.co/reference/daily-js/instance-methods/set-input-devices-async) internally.
     */
    setMicrophone: (deviceId: string) => Promise<void>;
    /**
     * Allows to switch to the speaker with the specified deviceId. Calls [setOutputDevice](https://docs.daily.co/reference/daily-js/instance-methods/set-output-device) internally.
     */
    setSpeaker: (deviceId: string) => Promise<void>;
    /**
     * A list of the user's speaker (audiooutput) devices. See [MediaDeviceInfo](https://developer.mozilla.org/en-US/docs/Web/API/MediaDeviceInfo) for more info.
     */
    speakers: StatefulDevice[];
};
export {};
