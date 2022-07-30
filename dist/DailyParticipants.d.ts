import { DailyParticipant } from '@daily-co/daily-js';
import React from 'react';
import type { Paths } from './types/paths';
/**
 * Extends DailyParticipant with convenient additional properties.
 */
export interface ExtendedDailyParticipant extends DailyParticipant {
    last_active?: Date;
}
declare type PropertyType = {
    id: string;
    property: Paths<ExtendedDailyParticipant>;
};
export declare const localIdState: import("recoil").RecoilState<string>;
export declare const participantsState: import("recoil").RecoilState<ExtendedDailyParticipant[]>;
/**
 * Holds each individual participant's state object.
 */
export declare const participantState: (param: string) => import("recoil").RecoilValueReadOnly<ExtendedDailyParticipant | null>;
/**
 * Holds each individual participant's property.
 */
export declare const participantPropertyState: (param: PropertyType) => import("recoil").RecoilValueReadOnly<any>;
export declare const DailyParticipants: React.FC<React.PropsWithChildren<{}>>;
export {};
