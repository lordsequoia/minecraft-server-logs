export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

export type LoggedMessage = {
    readonly timestamp: string
    readonly thread: string
    readonly level: LogLevel
    readonly message: string
}

export type LoggedEvent = {
    readonly eventName: string
    readonly eventData: readonly string[]
}

export type EventLog = LoggedMessage & LoggedEvent