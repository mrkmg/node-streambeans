import {Readable} from "stream";
import {StreamBeans} from "./StreamBeans";
import prettyBytes = require("pretty-bytes");

export * from "./StreamBeans";

export function toHuman(bytes: number) {
    return prettyBytes(bytes);
}

export default function createStreamBeans(stream?: Readable): StreamBeans {
    const beans = new StreamBeans();
    if (stream) {
        stream.pipe(beans);
    }
    return beans;
}
