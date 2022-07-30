import { DailyScreenCaptureOptions, DailyTrackState } from '@daily-co/daily-js';
export interface ScreenShare {
    local: boolean;
    screenAudio: DailyTrackState;
    screenVideo: DailyTrackState;
    screenId: string;
    session_id: string;
}
interface UseScreenShareArgs {
    onLocalScreenShareStarted?(): void;
    onLocalScreenShareStopped?(): void;
}
/**
 * Allows access to information about shared screens, and methods to start or stop a local screen share.
 */
export declare const useScreenShare: ({ onLocalScreenShareStarted, onLocalScreenShareStopped, }?: UseScreenShareArgs) => {
    isSharingScreen: boolean;
    screens: ScreenShare[];
    startScreenShare: (captureOptions?: DailyScreenCaptureOptions | undefined) => void;
    stopScreenShare: () => void;
};
export {};
