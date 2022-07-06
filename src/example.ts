/* eslint-disable functional/no-loop-statement */
import { join } from 'path'

import { readFileSync } from "fs-extra";
import { filter, map, Observable } from 'rxjs';

import { LoggedEvent, PlayerJoinedEvent, PlayerLeftEvent } from './lib/types';
import { createLoggedEvent, createLoggedMessage, streamLoggedEvents, streamLoggedEventsNamed, streamLoggedLines, streamLoggedMessages } from './lib/utils';

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

export const startStreamsDemo = (showDebug?: boolean) => {
    const lines$ = streamLoggedLines(join(process.cwd(), 'sample.log'), { fromBeginning: true })
    const messages$ = streamLoggedMessages(lines$)
    const events$ = streamLoggedEvents(messages$)

    if (showDebug === true) messages$.subscribe(v => console.debug(`[${v?.timestamp}] ${v?.message}`))
    if (showDebug === true) events$.subscribe(v => console.debug(`[${v?.timestamp}] {${v?.eventName || '...'}} -> ${v?.message}`))

    const playerJoined$ = events$.pipe(
        filter(v => v.eventName === 'playerJoined'),
        map(v => v as LoggedEvent<PlayerJoinedEvent>)
    )

    playerJoined$.subscribe(v => console.log(`[${v.timestamp}] <-- ${v.playerName} joined`))

    const playerLeft$ = streamLoggedEventsNamed(messages$, 'playerLeft') as Observable<LoggedEvent<PlayerLeftEvent>>

    playerLeft$.subscribe(v => console.log(`[${v.timestamp}] --> ${v.playerName} left`))

    const presenceEvents$ = events$.pipe(
        filter(v => v.eventName === 'playerJoined' || v.eventName === 'playerLeft')
    )

    presenceEvents$.subscribe(v => {
        const presenceEvent = v as LoggedEvent<PlayerJoinedEvent | PlayerLeftEvent>
        console.log(`[${v.timestamp}] ${v.eventName === 'playerJoined' ? 'JOIN <--' : 'LEFT -->'} ${presenceEvent.playerName}`)
    })

}

//startDemo()
startStreamsDemo(true)