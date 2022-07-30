import { DailyEventObjectParticipant } from '@daily-co/daily-js';
interface UseParticipantArgs {
    onParticipantLeft?(ev: DailyEventObjectParticipant): void;
    onParticipantUpdated?(ev: DailyEventObjectParticipant): void;
}
/**
 * Returns the participant identified by the given sessionId.
 * @param sessionId – The participant's session_id or "local".
 */
export declare const useParticipant: (sessionId: string, { onParticipantLeft, onParticipantUpdated }?: UseParticipantArgs) => import("../DailyParticipants").ExtendedDailyParticipant | null;
export {};
