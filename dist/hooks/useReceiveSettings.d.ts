import { DailyEventObjectReceiveSettingsUpdated, DailyReceiveSettings, DailySingleParticipantReceiveSettings } from '@daily-co/daily-js';
interface UseReceiveSettingsArgs {
    id?: string;
    onReceiveSettingsUpdated?(ev: DailyEventObjectReceiveSettingsUpdated): void;
}
/**
 * Allows to read and set receiveSettings.
 * In case receiveSettings for participant specified by id are empty, not set or 'inherit',
 * base receiveSettings will be returned.
 * In case meeting is not in joined state, calls to updateReceiveSettings will be silently ignored.
 */
export declare const useReceiveSettings: ({ id, onReceiveSettingsUpdated, }?: UseReceiveSettingsArgs) => {
    receiveSettings: DailySingleParticipantReceiveSettings;
    updateReceiveSettings: (receiveSettings: DailyReceiveSettings) => void;
};
export {};
