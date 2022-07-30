import { DailyEventObjectActiveSpeakerChange, DailyEventObjectParticipant, DailyParticipant } from '@daily-co/daily-js';
declare type FilterParticipantsFunction = (p: DailyParticipant, index: number, arr: DailyParticipant[]) => boolean;
declare type FilterParticipants = 'local' | 'remote' | 'owner' | 'record' | 'screen' | FilterParticipantsFunction;
declare type SortParticipantsFunction = (a: DailyParticipant, b: DailyParticipant) => 1 | -1 | 0;
declare type SortParticipants = 'joined_at' | 'session_id' | 'user_id' | 'user_name' | SortParticipantsFunction;
interface UseParticipantIdsArgs {
    filter?: FilterParticipants;
    onActiveSpeakerChange?(ev: DailyEventObjectActiveSpeakerChange): void;
    onParticipantJoined?(ev: DailyEventObjectParticipant): void;
    onParticipantLeft?(ev: DailyEventObjectParticipant): void;
    onParticipantUpdated?(ev: DailyEventObjectParticipant): void;
    sort?: SortParticipants;
}
/**
 * Returns a list of participant ids (= session_id).
 * The list can optionally be filtered and sorted, using the filter and sort options.
 */
export declare const useParticipantIds: ({ filter, onActiveSpeakerChange, onParticipantJoined, onParticipantLeft, onParticipantUpdated, sort, }?: UseParticipantIdsArgs) => string[];
export {};
