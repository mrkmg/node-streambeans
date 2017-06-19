import {DuplexOptions, Readable, Writable} from "stream";
import {StreamBeans} from "./StreamBeans";
import prettyBytes = require("pretty-bytes");

export * from "./StreamBeans";

export function toHuman(bytes: number) {
    return prettyBytes(bytes);
}

export function createStreamBeans(inStream?: Readable, outStream?: Writable, opts?: DuplexOptions): StreamBeans {
    const beans = new StreamBeans(opts);
    if (inStream) {
        inStream.pipe(beans);
    }
    if (outStream) {
        beans.pipe(outStream);
    }
    return beans;
}

export default createStreamBeans;
