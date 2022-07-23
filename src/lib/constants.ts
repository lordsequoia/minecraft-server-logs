import { TypedRegEx } from 'typed-regex';

/**
 * Typed regex pattern to parse a @see LoggedMessage
 */
export const LOGGED_MESSAGE_PATTERN = TypedRegEx(
  '^\\[(?<hh>\\d{2}):(?<mm>\\d{2}):(?<ss>\\d{2})\\] \\[(?<thread>[\\w|\\s]+)/(?<level>\\w+)\\]:\\s{1}(?<message>[\\w|\\s|\\W|\\d\\.]*)',
  'g'
);

/**
 * Typed regex patterns to parse a shape defined in @see LoggedEventData
 */
export const LOGGED_EVENT_PATTERNS = {
  playerJoined: TypedRegEx(
    '^(?<playerName>[\\w|\\W\\_]*) joined the game',
    'g'
  ),
  playerLeft: TypedRegEx('^(?<playerName>[\\w|\\W|\\_]*) left the game', 'g'),
  chatMessage: TypedRegEx(
    '^<(?<playerName>[\\w|\\W]*)> (?<messageContent>[\\w|\\W|\\_|\\d||\\s]*)',
    'g'
  ),
  serverStarting: TypedRegEx(
    'Starting minecraft server version (?<version>[\\.|\\d]*)',
    'g'
  ),
  serverStarted: TypedRegEx('Time elapsed: (?<startupTime>[\\d]*) ms/m', 'g'),
  serverStopping: TypedRegEx('Stopping the server', 'g'),
  serverStopped: TypedRegEx('Stopped the server', 'g'),
  anvilSaved: TypedRegEx(
    'ThreadedAnvilChunkStorage \\((?<dimension>[\\w|\\W|\\:|]*)\\): All chunks are saved',
    'g'
  ),
  preparingSpawn: TypedRegEx('Preparing spawn area: (?<progress>[\\d]*)%', 'g'),
};
