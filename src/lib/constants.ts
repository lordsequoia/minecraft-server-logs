import { TypedRegEx } from "typed-regex";



export const LOGGED_MESSAGE_PATTERN = '/\[(.*)\] \[(.*)\/(.*)\]: (.*)/m'
export const LOGGED_MESSAGE_REGEX = TypedRegEx(LOGGED_MESSAGE_PATTERN)