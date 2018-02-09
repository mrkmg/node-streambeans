import {closeSync, openSync, writeSync} from "fs";
import {Writable} from "stream";

export function sendDataOverTime(stream: Writable, data: string | Object, iterations: number, delay: number, done?: Function) {
    let i = 0;

    while (i < iterations) {
        setTimeout(() => stream.write(data), i * delay);
        i++;
    }
    if (done) {
        setTimeout(done, i * delay);
    }
}

export function makeFile(path: string, size: number) {
    const fp = openSync(path, "w");

    let i = 0;
    while (i < size) {
        writeSync(fp, "0");
        i++;
    }

    closeSync(fp);
}

export function NullStream(objectMode: boolean = false) {
    const write = (c: any, enc: string, cb: Function) => cb();
    return new Writable({write, objectMode});
}

export function StringStream(): any {
    let writable: Writable;
    const write = (c: any, enc: string, cb: Function) => {
        (writable as any).string += c.toString();
    };
    writable = new Writable({write});
    (writable as any).string = "";
    return writable;
}
