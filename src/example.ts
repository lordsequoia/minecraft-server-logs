/* eslint-disable functional/no-loop-statement */
import { join } from 'path'

import { readFileSync } from "fs-extra";

import { createLoggedEvent, createLoggedMessage } from './lib/utils';

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

startDemo()