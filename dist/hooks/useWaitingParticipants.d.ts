import { DailyEventObjectWaitingParticipant, DailyWaitingParticipant } from '@daily-co/daily-js';
interface UseWaitingParticipantsArgs {
    onWaitingParticipantAdded?(ev: DailyEventObjectWaitingParticipant): void;
    onWaitingParticipantUpdated?(ev: DailyEventObjectWaitingParticipant): void;
    onWaitingParticipantRemoved?(ev: DailyEventObjectWaitingParticipant): void;
}
export declare const waitingParticipantState: (param: string) => import("recoil").RecoilState<DailyWaitingParticipant>;
export declare const allWaitingParticipantsSelector: import("recoil").RecoilValueReadOnly<DailyWaitingParticipant[]>;
/**
 * Hook to access and manage waiting participants.
 */
export declare const useWaitingParticipants: ({ onWaitingParticipantAdded, onWaitingParticipantRemoved, onWaitingParticipantUpdated, }?: UseWaitingParticipantsArgs) => {
    waitingParticipants: DailyWaitingParticipant[];
    grantAccess: (id: '*' | string) => void;
    denyAccess: (id: '*' | string) => void;
};
export {};
