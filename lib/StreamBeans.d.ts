/// <reference types="node" />
import { Transform } from "stream";
export declare class StreamBeans extends Transform {
    lastSpeed: number;
    averageSpeed: number;
    overallSpeed: number;
    firstDataTimestamp: number;
    lastDataTimestamp: number;
    lastBytes: number;
    totalBytes: number;
    averageTimeFrame: number;
    private _lastHr;
    constructor();
    _transform(chunk: any, encoding: string, cb: Function): void;
    private _update(len);
    private _calculateAverageSpeed(currentSpeed, secondsPassed);
}
