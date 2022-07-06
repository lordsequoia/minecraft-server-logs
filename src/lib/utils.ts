/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statement */
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