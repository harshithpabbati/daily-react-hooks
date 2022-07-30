import { DailyEventObject, DailyEventObjectGenericError, DailyEventObjectLiveStreamingStarted, DailyLiveStreamingOptions, DailyStreamingLayoutConfig } from '@daily-co/daily-js';
interface UseLiveStreamingArgs {
    onLiveStreamingStarted?(ev: DailyEventObjectLiveStreamingStarted): void;
    onLiveStreamingStopped?(ev: DailyEventObject): void;
    onLiveStreamingError?(ev: DailyEventObjectGenericError): void;
}
/**
 * This hook allows to setup [live streaming events](https://docs.daily.co/reference/daily-js/events/live-streaming-events),
 * as well as starting, stopping and updating live streams.
 *
 * Returns the current live streaming state, incl. the current layout and potential errorMsg.
 */
export declare const useLiveStreaming: ({ onLiveStreamingError, onLiveStreamingStarted, onLiveStreamingStopped, }?: UseLiveStreamingArgs) => {
    startLiveStreaming: (options: DailyLiveStreamingOptions) => void;
    stopLiveStreaming: () => void;
    updateLiveStreaming: ({ layout }: {
        layout: DailyStreamingLayoutConfig | undefined;
    }) => void;
    errorMsg?: string | undefined;
    isLiveStreaming: boolean;
    layout?: import("@daily-co/daily-js").DailyStreamingDefaultLayoutConfig | import("@daily-co/daily-js").DailyStreamingSingleParticipantLayoutConfig | import("@daily-co/daily-js").DailyStreamingActiveParticipantLayoutConfig | import("@daily-co/daily-js").DailyStreamingPortraitLayoutConfig | import("@daily-co/daily-js").DailyStreamingCustomLayoutConfig | undefined;
};
export {};
