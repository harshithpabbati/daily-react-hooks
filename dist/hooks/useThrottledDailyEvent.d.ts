import { DailyEvent, DailyEventObject } from '@daily-co/daily-js';
declare type EventCallback = (events: DailyEventObject[]) => void;
/**
 * Sets up a throttled daily event listener using [on](https://docs.daily.co/reference/daily-js/instance-methods/on) method.
 * When this hook is unmounted the event listener is unregistered using [off](https://docs.daily.co/reference/daily-js/instance-methods/off).
 *
 * In comparison to useDailyEvent the callback passed here will be called with an array of event objects.
 *
 * @param ev The DailyEvent to register.
 * @param callback A memoized callback reference to run when throttled events are emitted.
 * @param throttleTimeout The minimum waiting time until the callback is called again. Default: 100
 */
export declare const useThrottledDailyEvent: (ev: DailyEvent, callback: EventCallback, throttleTimeout?: number) => void;
export {};
