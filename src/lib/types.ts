import { LOGGED_EVENT_PATTERNS } from "./constants"

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

export type LogTimestamp = {
    readonly hh: string
    readonly mm: string
    readonly ss: string
}

export type LoggedMessage = {
    readonly timestamp: string
    readonly thread: string
    readonly level: LogLevel
    readonly message: string
}

export type PlayerJoinedEvent = {
    readonly playerName: string
}

export type PlayerLeftEvent = {
    readonly playerName: string
}

export type ChatMessageEvent = {
    readonly playerName: string
    readonly messageContent: string
}

export type LoggedEventData =
    | PlayerJoinedEvent
    | PlayerLeftEvent
    | ChatMessageEvent

export type LoggedEventName = keyof typeof LOGGED_EVENT_PATTERNS

export type LoggedEvent = LoggedMessage & LoggedEventData & {
    readonly eventName: LoggedEventName
}