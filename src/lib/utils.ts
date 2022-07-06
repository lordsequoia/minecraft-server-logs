/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
import { filter, map, Observable } from "rxjs"
import { Tail, TailOptions } from "tail"

import { LOGGED_EVENT_PATTERNS, LOGGED_MESSAGE_PATTERN } from "./constants"
import { LoggedEvent, LoggedMessage, LogLevel } from "./types"

export const createLoggedMessage = (rawLog: string): LoggedMessage | undefined => {
    const parsed = LOGGED_MESSAGE_PATTERN.captures(rawLog)

    if (parsed === undefined) return undefined

    const { hh, mm, ss, thread, level, message } = parsed

    return {
        timestamp: `${hh}:${mm}:${ss}`,
        thread,
        level: level as LogLevel,
        message,
    }
}

export const createLoggedEvent = (message?: string | LoggedMessage): LoggedEvent | undefined => {
    if (message === undefined) return undefined

    if (typeof message === 'string') {
        return createLoggedEvent(createLoggedMessage(message as string))
    }

    for (const eventName in LOGGED_EVENT_PATTERNS) {
        const pattern = LOGGED_EVENT_PATTERNS[eventName]
        const result = pattern.captures(message.message)

        if (result !== undefined) {
            const eventData = Object.assign(result, { eventName })
            return Object.assign(message, eventData)
        }
    }

    return undefined
}

export const asMessage = map((v: string | LoggedMessage) => typeof v !== 'string' ? v : createLoggedMessage(v))
export const asEvent = map((v?: LoggedMessage | LoggedEvent) =>
    typeof v === undefined ? undefined : (typeof Object.assign({ eventName: undefined }, v).eventName === undefined ? createLoggedEvent(v) : v))

export const isDefined = filter((v?: LoggedEvent) => v !== undefined)

export const makeLines$ = (v: string | Observable<string>) =>
    typeof v === 'string' ? streamLoggedLines(v) : v

export const makeMessages$ = (v: string | Observable<string | LoggedMessage>) =>
    typeof v === 'string' ? makeLines$(v) : v.pipe(asMessage)

export const makeEvents$ = (v: string | Observable<string | LoggedMessage>) =>
    (typeof v === 'string' ? makeLines$(v) : v).pipe(asMessage, asEvent)

export const streamLoggedLines = (source: string, options?: TailOptions): Observable<string> =>
    new Observable<string>(subscriber => {
        const source$ = new Tail(source, options)

        source$.on('line', v => subscriber.next(v))
        source$.on('error', v => subscriber.error(v))
    })

export const streamLoggedMessages = (source: string | Observable<string>) =>
    makeLines$(source).pipe(asMessage, isDefined)

export const streamLoggedEvents = (source: string | Observable<string | LoggedMessage>): Observable<LoggedEvent> =>
    makeEvents$(source).pipe(asMessage, asEvent, isDefined)