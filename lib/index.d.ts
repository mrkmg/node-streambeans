/// <reference types="node" />
import { Readable } from "stream";
import { StreamBeans } from "./StreamBeans";
export * from "./StreamBeans";
export declare function toHuman(bytes: number): string;
export default function createStreamBeans(stream?: Readable): StreamBeans;
