import { DuplexOptions, Transform } from "stream";
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
    private _isObjectMode;
    constructor(opts?: DuplexOptions);
    _transform(chunk: any, encoding: string, cb: Function): void;
    private _update;
    private _calculateAverageSpeed;
}
