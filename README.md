# minecraft-server-logs

> Library for parsing and streaming Minecraft logs

## Install

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i minecraft-server-logs --save
```

or

```sh
$ yarn add minecraft-server-logs
```

## Usage

```js
const { createLoggedMessage } = require('minecraft-server-logs');

const message = createLoggedMessage(
  '[00:00:00] [Dummy thread/INFO]: Hello world!'
);

console.dir(message);
// outputs: { timestamp: '00:00:00', thread: 'Dummy thread', level: 'INFO', message: 'Hello world!'}
```

```ts
import { createLoggedMessage } = from 'minecraft-server-logs';

const message = createLoggedMessage('[00:00:00] [Dummy thread/INFO]: Hello world!');
console.dir(message);
// outputs: { timestamp: '00:00:00', thread: 'Dummy thread', level: 'INFO', message: 'Hello world!'}

const event = createLoggedEvent(message);
console.dir(event);
// outputs: {
//    timestamp: '00:00:00',
//    thread: 'Dummy thread',
//    level: 'INFO',
//    message: 'Dummy joined the game',
//    eventName: 'playerJoined',
//    playerName: 'Dummy'
// }
```

```ts
import { streamLoggedLines, streamLoggedMessages } from 'minecraft-server-logs';

import { appendFileSync } from 'fs';
import { join } from 'path';

const logsFile = join(process.cwd(), 'logs', 'latest.log');

const messages$ = streamLoggedMessages(
  streamLoggedLines(logsFile, {
    fromBeginning: true,
  })
);

messages$.subscribe((v) => console.log(`${v.timestamp}: ${v.message}`));

appendFileSync(logsFile, '[00:00:00] [Dummy thread/INFO]: Hello world!\n');

// outputs: 00:00:00: Hello world!
```

```ts
import { streamLoggedEvents } from 'minecraft-server-logs';
import { filter, map } from 'rxjs';

const events$ = streamLoggedEvents('./logs/latest.log');

const playerJoined$ = events$.pipe(
  filter((v) => v.eventName === 'playerJoined'),
  map((v) => v as LoggedEvent<PlayerJoinedEvent>)
);
```

```ts
import {
  HasEventName,
  LoggedEvent,
  PlayerJoinedEvent,
  PlayerLeftEvent,
} from 'minecraft-server-logs';

import { filter, map } from 'rxjs';

const filterPresenceEvents = filter(
  ({ eventName }: HasEventName) =>
    eventName === 'playerJoined' || eventName === 'playerLeft'
);

const mapToPresenceEvent = map(
  (v: LoggedEvent) => v as LoggedEvent<PlayerJoinedEvent | PlayerLeftEvent>
);

const presence$ = events$.pipe(filterPresenceEvents, mapToPresenceEvent);

presence$.subscribe(({ eventName, timestamp, playerName }) => {
  console.log(`[${timestamp}] ${eventName}(${playerName})`);
});
```

```js
const { openSync, appendFileSync } = require('fs');
const {
  createLoggedMessage,
  createLoggedEvent,
  streamLoggedMessages,
  streamLoggedEvents,
  filterEq,
  streamLoggedEventsNamed,
} = require('minecraft-server-logs');
const { of, interval } = require('rxjs');

const HELLO_WORLD =
  '[00:00:00] [Dummy thread/INFO]: LordSequoia joined the game';

const message = createLoggedMessage(HELLO_WORLD);
const event = createLoggedEvent(message);
console.dir({ rawLog: HELLO_WORLD, message, event });

const rawLogs = of(
  '[00:00:00] [Foo thread/INFO]: Server starting',
  '[00:00:00] [Dummy thread/INFO]: Hello world!',
  '[00:00:01] [Server thread/INFO]: LordSequoia joined the game',
  '[00:00:02] [Server thread/INFO]: Starting minecraft server version (1.19)',
  '[00:00:03] [Dummy thread/INFO]: <LordSequoia> Hello world!',
  '[00:00:01] [Server thread/INFO]: LordSequoia left the game'
);

// const rawLogs = './logs/latest.log'
const messages$ = streamLoggedMessages(rawLogs);
const events$ = streamLoggedEvents(rawLogs);

messages$.subscribe(({ timestamp, thread, level, message }) =>
  console.log(`[${level}] ${timestamp}: ${message}`)
);

events$.subscribe((v) => console.log(`[EVENT] ${v.eventName}`));

const playerJoined$ = events$.pipe(filterEq('eventName', 'playerJoined'));

playerJoined$.subscribe(({ timestamp, playerName }) =>
  console.log(`${timestamp} ${playerName} joined!`)
);

const playerLeft$ = streamLoggedEventsNamed(rawLogs, 'playerLeft');

playerLeft$.subscribe(({ timestamp, playerName }) =>
  console.log(`${timestamp} ${playerName} left :(`)
);

const serverEvents$ = streamLoggedEvents('./logs/latest.log');
serverEvents$.subscribe((v) =>
  console.log(`[REAL-TIME] ${v.eventName} -> ${v.message}`)
);

const appendLog = (rawLog) => {
  const appendOpts = { encoding: 'utf-8', flag: 'w' };
  appendFileSync('./logs/latest.log', '\n' + rawLog, appendOpts);
};

interval(3 * 1000).subscribe((v) =>
  appendLog(`[00:00:03] [Dummy thread/INFO]: <LordSequoia> Hello world ${v}!`)
);
```

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/lordsequoia/minecraft-server-logs/issues)

## Author

**LordSequoia**

- [github/](https://github.com/)
- [twitter/](http://twitter.com/)

## License

Copyright © 2022 [LordSequoia](https://github.com/lordsequoia)
Licensed under the MIT license.

---

_This file was generated by [readme-generator](https://github.com/jonschlinkert/readme-generator) on July 06, 2022._
