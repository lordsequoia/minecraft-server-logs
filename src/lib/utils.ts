/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { Observable } from 'rxjs';
import { Tail, TailOptions } from 'tail';

import { LOGGED_EVENT_PATTERNS, LOGGED_MESSAGE_PATTERN } from './constants';
import { def, eq, evt, msg } from './operations';
import { LoggedEvent, LoggedEventName, LoggedMessage, LogLevel } from './types';

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

export const makeLines$ = (v: string | Observable<string>) =>
  typeof v === 'string' ? streamLoggedLines(v) : v;

export const makeMessages$ = (v: string | Observable<LoggedMessage>) =>
  typeof v === 'string' ? makeLines$(v) : v.pipe(msg);

export const makeEvents$ = (v: string | Observable<string | LoggedMessage>) =>
  (typeof v === 'string' ? makeLines$(v) : v).pipe(evt);

export const streamLoggedLines = (
  source: string,
  options?: TailOptions
): Observable<string> =>
  new Observable<string>((subscriber) => {
    const source$ = new Tail(source, options);

    source$.on('line', (v) => subscriber.next(v));
    source$.on('error', (v) => subscriber.error(v));
  });

export const streamLoggedMessages = (source: string | Observable<string>) =>
  makeLines$(source).pipe(msg, def);

export const streamLoggedEvents = (
  source: string | Observable<LoggedMessage>
): Observable<LoggedEvent> =>
  (typeof source === 'string' ? makeLines$(source).pipe(msg) : source).pipe(
    evt,
    def
  );

export const streamLoggedEventsBy = (
  source: string | Observable<LoggedMessage>,
  key: keyof LoggedEvent,
  value: LoggedEvent[keyof LoggedEvent]
) => streamLoggedEvents(source).pipe(eq(key, value));

export const streamLoggedEventsNamed = (
  source: string | Observable<LoggedMessage>,
  eventName: LoggedEventName
) => streamLoggedEventsBy(source, 'eventName', eventName);
