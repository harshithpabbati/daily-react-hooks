import { DailyEventObjectInputSettingsUpdated, DailyEventObjectNonFatalError, DailyInputSettings } from '@daily-co/daily-js';
interface UseInputSettingsArgs {
    onError?(ev: DailyEventObjectNonFatalError): void;
    onInputSettingsUpdated?(ev: DailyEventObjectInputSettingsUpdated): void;
}
export declare const useInputSettings: ({ onError, onInputSettingsUpdated, }?: UseInputSettingsArgs) => {
    errorMsg: string | null;
    inputSettings: DailyInputSettings | null;
    updateInputSettings: (inputSettings: DailyInputSettings) => void;
};
export {};
