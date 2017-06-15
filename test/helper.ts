import {Writable} from "stream";
import {closeSync, openSync, writeSync} from "fs";

export function sendDataOverTime(stream: Writable, data: string, iterations: number, delay: number, done?: Function) {
    let i = 0;

    while(i < iterations) {
        setTimeout(() => stream.write(data), i * delay);
        i++;
    }
    if (done){
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


export function NullStream() {
    return new Writable({
        write(c: any, enc: string, cb: Function){ cb(); }
    });
}
