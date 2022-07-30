import { DailyEventObjectNoPayload, DailyEventObjectRecordingData, DailyEventObjectRecordingStarted, DailyStreamingLayoutConfig, DailyStreamingOptions } from '@daily-co/daily-js';
interface UseRecordingArgs {
    onRecordingData?(ev: DailyEventObjectRecordingData): void;
    onRecordingError?(ev: DailyEventObjectNoPayload): void;
    onRecordingStarted?(ev: DailyEventObjectRecordingStarted): void;
    onRecordingStopped?(ev: DailyEventObjectNoPayload): void;
}
export declare const useRecording: ({ onRecordingData, onRecordingError, onRecordingStarted, onRecordingStopped, }?: UseRecordingArgs) => {
    startRecording: (options?: DailyStreamingOptions | undefined) => void;
    stopRecording: () => void;
    updateRecording: (options: {
        layout?: DailyStreamingLayoutConfig | undefined;
    }) => void;
    /**
     * Determines wether an error occurred during the last recording attempt.
     */
    error?: boolean | undefined;
    /**
     * Determines wether the local participant is being recorded, based on the recording settings.
     */
    isLocalParticipantRecorded: boolean;
    /**
     * Determines wether a recording is currently running or not.
     */
    isRecording: boolean;
    /**
     * Contains the last applied cloud recording layout config.
     */
    layout?: import("@daily-co/daily-js").DailyStreamingDefaultLayoutConfig | import("@daily-co/daily-js").DailyStreamingSingleParticipantLayoutConfig | import("@daily-co/daily-js").DailyStreamingActiveParticipantLayoutConfig | import("@daily-co/daily-js").DailyStreamingPortraitLayoutConfig | import("@daily-co/daily-js").DailyStreamingCustomLayoutConfig | undefined;
    /**
     * Determines wether the recording is running locally.
     * See [enable_recording](https://docs.daily.co/reference/rest-api/rooms/config#enable_recording).
     */
    local?: boolean | undefined;
    /**
     * Contains the recording id.
     */
    recordingId?: string | undefined;
    /**
     * Contains the date when the 'recording-started' event was received.
     * This doesn't necessarily match the date the recording was actually started.
     */
    recordingStartedDate?: Date | undefined;
    /**
     * Contains the session_id of the participant who started the recording.
     */
    startedBy?: string | undefined;
    /**
     * Contains the recording type.
     * See [enable_recording](https://docs.daily.co/reference/rest-api/rooms/config#enable_recording).
     */
    type?: string | undefined;
};
export {};
