/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { Observable } from 'rxjs';
import { Tail, TailOptions } from 'tail';

import { LOGGED_EVENT_PATTERNS, LOGGED_MESSAGE_PATTERN } from './constants';
import { def, eq, evt, msg } from './operations';
import { LoggedEvent, LoggedEventName, LoggedMessage, LogLevel } from './types';

/**
 * Parses a logged message from a logged line.
 *
 * @param rawLog a logged line as string
 * @returns a log message of type @see LoggedMessage
 */
export const createLoggedMessage = (
  rawLog: string
): LoggedMessage | undefined => {
  const parsed = LOGGED_MESSAGE_PATTERN.captures(rawLog);

  if (parsed === undefined) return undefined;

  const { hh, mm, ss, thread, level, message } = parsed;

  return {
    timestamp: `${hh}:${mm}:${ss}`,
    thread,
    level: level as LogLevel,
    message,
  };
};

/**
 * Parses a logged event from a logged message.
 *
 * @param message The @see LoggedMessage to parse.
 * @returns An object shaped as @see LoggedEvent
 */
export const createLoggedEvent = (
  message?: string | LoggedMessage
): LoggedEvent | undefined => {
  if (message === undefined) return undefined;

  if (typeof message === 'string') {
    return createLoggedEvent(createLoggedMessage(message as string));
  }

  for (const eventName in LOGGED_EVENT_PATTERNS) {
    const pattern = LOGGED_EVENT_PATTERNS[eventName];
    const result = pattern.captures(message.message);

    if (result !== undefined) {
      const eventData = Object.assign(result, { eventName });
      return Object.assign(message, eventData);
    }
  }

  return undefined;
};

/**
 * Transform a path to a stream of @see string or return the provided value if it is already a stream of @see string.
 *
 * @param v A filepath or stream of @see string.
 * @returns A stream of @see string
 */
export const makeLines$ = (v: string | Observable<string>) =>
  typeof v === 'string' ? streamLoggedLines(v) : v;

/**
 * Transform a path to a stream of @see LoggedMessage or return the provided value if it is already a stream of @see LoggedMessage.
 *
 * @param v a filepath or stream of @see LoggedMessage
 * @returns A stream of @see LoggedMessage
 */
export const makeMessages$ = (v: string | Observable<LoggedMessage>) =>
  typeof v === 'string' ? makeLines$(v) : v.pipe(msg);

/**
 * Transform a path to a stream of @see Loggedevent or return the provided value if it is already a stream of @see LoggedEvent.
 *
 * @param v a filepath or stream of @see LoggedEvent
 * @returns A stream of @see LoggedEvent
 */
export const makeEvents$ = (v: string | Observable<string | LoggedMessage>) =>
  (typeof v === 'string' ? makeLines$(v) : v).pipe(evt);

/**
 * Stream logged lines from a logs file.
 *
 * @param source The path of a logs file.
 * @param options Options to provide to Tail. @see TailOptions
 * @returns A stream of logged lines (string)
 */
export const streamLoggedLines = (
  source: string,
  options?: TailOptions
): Observable<string> =>
  new Observable<string>((subscriber) => {
    const source$ = new Tail(source, options);

    source$.on('line', (v) => subscriber.next(v));
    source$.on('error', (v) => subscriber.error(v));
  });

/**
 * Stream logged messages.
 *
 * @param source The path of a logs file or an Observable<string>
 * @returns
 */
export const streamLoggedMessages = (source: string | Observable<string>) =>
  makeLines$(source).pipe(msg, def);

export const streamLoggedEvents = (
  source: string | Observable<LoggedMessage>
): Observable<LoggedEvent> =>
  (typeof source === 'string' ? makeLines$(source).pipe(msg) : source).pipe(
    evt,
    def
  );

/**
 * Stream logged events matching the provided value for the provided key.
 *
 * @param source The path of a logs file or an Observable<string>
 * @param key Filter key
 * @param value Value to match for the provided key
 * @returns A subset of the source stream
 */
export const streamLoggedEventsBy = (
  source: string | Observable<LoggedMessage>,
  key: keyof LoggedEvent,
  value: LoggedEvent[keyof LoggedEvent]
) => streamLoggedEvents(source).pipe(eq(key, value));

/**
 * Stream logged events matching provided eventName.
 *
 * @param source The path of a logs file or an Observable<string>
 * @param eventName a key of @see LOGGED_EVENT_PATTERNS
 * @returns A subset of the source stream
 */
export const streamLoggedEventsNamed = (
  source: string | Observable<LoggedMessage>,
  eventName: LoggedEventName
) => streamLoggedEventsBy(source, 'eventName', eventName);
