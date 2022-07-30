import { DailyCall, DailyCallOptions } from '@daily-co/daily-js';
import React from 'react';
declare type DailyProperties = Pick<DailyCallOptions, 'audioSource' | 'dailyConfig' | 'receiveSettings' | 'subscribeToTracksAutomatically' | 'token' | 'url' | 'userName' | 'videoSource'>;
declare type Props = DailyProperties | {
    callObject: DailyCall;
};
export declare const DailyProvider: React.FC<React.PropsWithChildren<Props>>;
export {};
