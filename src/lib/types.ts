import { LOGGED_EVENT_PATTERNS } from './constants';

/**
 * The loglevel of a @see LoggedMessage
 */
export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

/**
 * A logged message.
 *
 */
export type LoggedMessage = {
  readonly timestamp: string;
  readonly thread: string;
  readonly level: LogLevel;
  readonly message: string;
};

/**
 * A player presence event (@see PlayerJoinedEvent or @see PlayerLeftEvent)
 */
export type PresenceEvent<T = 'joined' | 'left'> = {
  readonly playerName: string;
  readonly incident: T;
};

/**
 * A player joined the game.
 */
export type PlayerJoinedEvent = PresenceEvent<'joined'>;

/**
 * A player left the game.
 */
export type PlayerLeftEvent = PresenceEvent<'left'>;

/**
 * A chat message was sent.
 */
export type ChatMessageEvent = {
  readonly playerName: string;
  readonly messageContent: string;
};

/**
 * Anvil storage has saved the world's chunks.
 */
export type AnvilSavedEvent = {
  readonly dimension: string;
};

/**
 * Preparing spawn progress (in %).
 */
export type ProgressEvent = {
  readonly progress: string;
};

/**
 * All shapes of events parseable using this lib.
 */
export type LoggedEventData =
  | PlayerJoinedEvent
  | PlayerLeftEvent
  | ChatMessageEvent
  | AnvilSavedEvent
  | ProgressEvent
  | unknown;

/**
 * A logged event name, which is a key of @see LOGGED_EVENT_PATTERNS
 */
export type LoggedEventName = keyof typeof LOGGED_EVENT_PATTERNS;

export type HasEventName = {
  readonly eventName: LoggedEventName;
};

/**
 * A logged event.
 */
export type LoggedEvent<T = LoggedEventData | unknown> = LoggedMessage &
  HasEventName &
  T;
