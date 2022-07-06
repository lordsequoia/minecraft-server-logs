import { filter, map } from "rxjs"

import { LoggedEvent, LoggedMessage } from "./types"
import { createLoggedEvent, createLoggedMessage } from "./utils"

export const eq = <T>(key: keyof T, value: T[keyof T]) => filter(v => v[key] === value)
export const neq = <T>(key: keyof T, value: T[keyof T]) => filter(v => v[key] !== value)
export const msg = map((v: string | LoggedMessage) => typeof v !== 'string' ? v : createLoggedMessage(v))
export const evt = map((v?: LoggedMessage | LoggedEvent) =>
    typeof v === undefined ? undefined : (Object.assign({ eventName: undefined }, v).eventName === undefined ? createLoggedEvent(v) : v))

export const def = filter((v?: LoggedEvent) => v !== undefined)
