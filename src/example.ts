import { TypedRegEx } from "typed-regex";

export const startDemo0 = () => {
    const regex = TypedRegEx('\\[?<p1>(.*)\\] ?<p2>\\[?<p3>(.*)/?<p4>(.*)\\]: ?<p5>(.*)', 'g');
    const input = '[00:11:22] [Dummy/INFO]: <Bonzai> Hello world!'

    const result = regex.captures(input);

    console.dir(result) // : undefined | { year: string, month: string, day: string }
}

export const startDemo1 = () => {
    const regex = TypedRegEx('(?<first>\\d+)/(?<second>\\w+)?', 'g');
    const result = regex.captures('1234/foobar');

    console.dir(result) // : undefined | { first: string, second?: string }
}

export const startDemo2 = () => {
    const regex = TypedRegEx('^(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})$', 'g');
    const result = regex.captures('2020-12-02');

    console.dir(result) // : undefined | { year: string, month: string, day: string }
}

export const startDemo3 = () => {
    const regex = TypedRegEx('^(?<hh>\\d{2}):(?<mm>\\d{2}):(?<dd>\\d{2})$', 'g');
    const input = '00:11:22'

    const result = regex.captures(input);

    console.dir(result) // : undefined | { year: string, month: string, day: string }
}

export const startDemo4 = () => {
    const regex = TypedRegEx('^\\[(?<hh>\\d{2}):(?<mm>\\d{2}):(?<dd>\\d{2})\\]$', 'g');
    const input = '[00:11:22]'

    const result = regex.captures(input);

    console.dir(result) // : undefined | { year: string, month: string, day: string }
}

export const startDemo5 = () => {
    const regex = TypedRegEx('^\\[(?<hh>\\d{2}):(?<mm>\\d{2}):(?<dd>\\d{2})\\] \\[(?<thread>[\\w|\\s]+)/(?<level>\\w+)\\]?', 'g');
    const input = '[00:11:22] [Dummy thread/INFO]'

    const result = regex.captures(input);

    console.dir(result) // : undefined | { year: string, month: string, day: string }
}

export const startDemo6 = () => {
    const regex = TypedRegEx('^\\[(?<hh>\\d{2}):(?<mm>\\d{2}):(?<dd>\\d{2})\\] \\[(?<thread>[\\w|\\s]+)/(?<level>\\w+)\\]:\\s{1}(?<message>[\\w|\\s|\\W|\\d]+)?', 'g');
    const input = '[00:11:22] [Dummy thread/INFO]: Hello world'

    const result = regex.captures(input);

    console.dir(result) // : undefined | { year: string, month: string, day: string }
}

export const startDemo7 = () => {
    const regex = TypedRegEx('^\\[(?<hh>\\d{2}):(?<mm>\\d{2}):(?<dd>\\d{2})\\] \\[(?<thread>[\\w|\\s]+)/(?<level>\\w+)\\]:\\s{1}(?<message>[\\w|\\s|\\W|\\d\\.]+)?', 'g');
    const input = '[00:11:22] [Dummy thread/INFO]: <Hello> world'

    const result = regex.captures(input);

    console.dir(result) // : undefined | { year: string, month: string, day: string }
}

startDemo0()
startDemo6()
startDemo7()