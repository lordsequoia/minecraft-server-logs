/* eslint-disable functional/no-loop-statement */
import { join } from 'path'

import { readFileSync } from "fs-extra";
import { filter, map } from 'rxjs';

import { LoggedEvent, PlayerJoinedEvent } from './lib/types';
import { createLoggedEvent, createLoggedMessage, streamLoggedEvents, streamLoggedLines, streamLoggedMessages } from './lib/utils';

export const startDemo = () => {
    const sampleLogs = String(readFileSync(join(process.cwd(), 'sample.log')))

    for (const sampleLog of sampleLogs.split('\n')) {
        const message = createLoggedMessage(sampleLog)
        const event = createLoggedEvent(message)

        if (event === undefined) {
            console.log(`[....] ${message?.message}`)
        } else {
            console.log(`[${event.eventName}] ${message?.message}`, event)
        }
    }
}

export const startStreamsDemo = () => {
    const lines$ = streamLoggedLines(join(process.cwd(), 'sample.log'), { fromBeginning: true })
    const messages$ = streamLoggedMessages(lines$)
    const events$ = streamLoggedEvents(lines$)

    messages$.subscribe(v => console.log(`[${v?.timestamp}] ${v?.message}`))

    const playerJoined$ = events$.pipe(
        filter(v => v.eventName === 'playerJoined'),
        map(v => v as LoggedEvent<PlayerJoinedEvent>)
    )

    playerJoined$.subscribe(v => console.log(`--> [${v.timestamp}] ${v.playerName} joined`))
}

startDemo()
startStreamsDemo()