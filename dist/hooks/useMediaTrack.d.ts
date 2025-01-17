import { DailyParticipant, DailyTrackState } from '@daily-co/daily-js';
declare type MediaType = keyof DailyParticipant['tracks'];
export interface MediaTrackState extends DailyTrackState {
    isOff: boolean;
}
/**
 * Returns a participant's track and state, based on the given MediaType.
 *
 * Equivalent to daily.participants()[participantId].tracks[type].
 *
 * @param participantId The participant's session_id.
 * @param type The track type. Default: "video"
 */
export declare const useMediaTrack: (participantId: string, type?: MediaType) => MediaTrackState;
export {};
