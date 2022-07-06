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

export type PresenceEvent<T = 'joined' | 'left'> = {
    readonly playerName: string
    readonly incident: T
}


export type PlayerJoinedEvent = PresenceEvent<'joined'>
export type PlayerLeftEvent = PresenceEvent<'left'>


export type LifecycleEvent = {
    readonly incident: string
}

export type ChatMessageEvent = {
    readonly playerName: string
    readonly messageContent: string
}

export type AnvilSavedEvent = {
    readonly dimension: string
}

export type ProgressEvent = {
    readonly progress: string
}

export type LoggedEventData =
    | PlayerJoinedEvent
    | PlayerLeftEvent
    | ChatMessageEvent
    | AnvilSavedEvent
    | LifecycleEvent
    | ProgressEvent
    | unknown

export type LoggedEventName = keyof typeof LOGGED_EVENT_PATTERNS

export type LoggedEvent = LoggedMessage & LoggedEventData & {
    readonly eventName: LoggedEventName
}