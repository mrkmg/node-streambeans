/// <reference types="node" />
import { DuplexOptions, Readable, Writable } from "stream";
import { StreamBeans } from "./StreamBeans";
export * from "./StreamBeans";
export declare function toHuman(bytes: number): string;
export declare function createStreamBeans(inStream?: Readable, outStream?: Writable, opts?: DuplexOptions): StreamBeans;
export default createStreamBeans;
