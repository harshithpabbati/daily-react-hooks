import type { Paths } from '../types/paths';
import { ExtendedDailyParticipant } from '../DailyParticipants';
/**
 * Returns a participant's property that you subscribe to.
 * @param participantId The participant's session_id.
 * @param propertyPath the participant property that you want to subscribe to.
 */
export declare const useParticipantProperty: (participantId: string, propertyPath: Paths<ExtendedDailyParticipant>) => any;
