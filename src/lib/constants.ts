import { TypedRegEx } from "typed-regex";

export const LOGGED_MESSAGE_PATTERN = TypedRegEx('^\\[(?<hh>\\d{2}):(?<mm>\\d{2}):(?<ss>\\d{2})\\] \\[(?<thread>[\\w|\\s]+)/(?<level>\\w+)\\]:\\s{1}(?<message>[\\w|\\s|\\W|\\d\\.]*)', 'g');

export const LOGGED_EVENT_PATTERNS = {
    playerJoined: TypedRegEx('^(?<playerName>[\\w|\\W\\_]*) joined the game', 'g'),
    playerLeft: TypedRegEx('^(?<playerName>[\\w|\\W\\_]*) left the game', 'g'),
    chatMessage: TypedRegEx('^<(?<playerName>[\\w|\\W]*)> (?<messageContent>[\\.*])', 'g'),
    serverStarting: TypedRegEx('Starting minecraft server version (<?version>[\\.]*)', 'g'),
    serverStarted: TypedRegEx('Time elapsed: (<?startupTime>\\d*) ms/m', 'g'),
    serverStopping: TypedRegEx('Stopping the server', 'g'),
    serverStopped: TypedRegEx('Stopped the server', 'g'),
    anvilSaved: TypedRegEx('ThreadedAnvilChunkStorage (<?dimension>[\\.]*): All chunks are saved', 'g'),
    preparingSpawn: TypedRegEx('Preparing spawn area: (<?progress>[\\d]*)%', 'g'),
}

/*const serverLogTypes = {
    serverStarting: { regex: /Starting minecraft server version (.*)/, groups: ['version'] },
    serverStarted: { regex: /Time elapsed: (\d*) ms/m, groups: ['startupTime'] },
    serverStopping: { regex: /Stopping the server/m, groups: [] },
    serverStopped: { regex: /Stopped the server/m, groups: [] },
    preparingSpawn: { regex: /Preparing spawn area: (\d*)%/, groups: ['progress'] },
    playerJoined: { regex: /(.*) joined the game/m, groups: ['playerName'] },
    playerLeft: { regex: /(.*) left the game/m, groups: ['playerName'] },
    chatMessage: { regex: /<(.*)> (.*)/m, groups: ['playerName', 'messageContent'] },
}*/