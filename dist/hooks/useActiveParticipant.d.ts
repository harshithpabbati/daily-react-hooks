import { DailyEventObjectActiveSpeakerChange } from '@daily-co/daily-js';
interface UseActiveParticipantArgs {
    /**
     * If set to true, useActiveParticipant will never return the local participant.
     */
    ignoreLocal?: boolean;
    /**
     * Optional event callback for [active-speaker-change](https://docs.daily.co/reference/daily-js/events/meeting-events#active-speaker-change) event listener.
     */
    onActiveSpeakerChange?(ev: DailyEventObjectActiveSpeakerChange): void;
}
/**
 * Returns the most recent participant mentioned in an [active-speaker-change](https://docs.daily.co/reference/daily-js/events/meeting-events#active-speaker-change) event.
 */
export declare const useActiveParticipant: ({ ignoreLocal, onActiveSpeakerChange, }?: UseActiveParticipantArgs) => import("..").ExtendedDailyParticipant | null;
export {};
