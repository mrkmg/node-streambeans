/// <reference types="node" />
import { Readable, Writable } from "stream";
import { StreamBeans } from "./StreamBeans";
export * from "./StreamBeans";
export declare function toHuman(bytes: number): string;
export declare function createStreamBeans(inStream?: Readable, outStream?: Writable): StreamBeans;
export default createStreamBeans;
