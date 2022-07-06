import { filter, map } from 'rxjs';

import { LoggedEvent, LoggedMessage } from './types';
import { createLoggedEvent, createLoggedMessage } from './utils';

/**
 * Creates a stream of T based on an input stream of T matching a value for a specific key.
 *
 * @param key Property name
 * @param value Value for the property provided in key.
 * @returns Subset of the input stream emitting only items matching obj[key] === value
 */
export const filterEq = <T>(key: keyof T, value: T[keyof T]) => filter((v) => v[key] === value);

/**
 * Creates a stream of T based on an input stream of T of items not matching a value for a specific key.
 *
 * @param key Property name
 * @param value Value for the property provided in key.
 * @returns Subset of the input stream emitting only items matching obj[key] !== value
 */
export const filterNeq = <T>(key: keyof T, value: T[keyof T]) => filter((v) => v[key] !== value);

/**
 * Filters a stream to emit only defined values
 */
export const filterDef = filter((v?: LoggedEvent) => v !== undefined);

/**
 * Maps a stream of strings and/or messages to a stream of messages
 */
export const mapMessage = map((v: string | LoggedMessage) => typeof v !== 'string' ? v : createLoggedMessage(v));

/**
 * Maps a stream of messages and/or events to a stream of events.
 */
export const mapEvent = map((v?: LoggedMessage | LoggedEvent) =>
    typeof v === undefined
        ? undefined
        : Object.assign({ eventName: undefined }, v).eventName === undefined
            ? createLoggedEvent(v)
            : v
);
