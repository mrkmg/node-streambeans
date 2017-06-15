import {Transform} from "stream";

export class StreamBeans extends Transform {
    public lastSpeed: number          = 0;
    public averageSpeed: number       = 0;
    public overallSpeed: number       = 0;
    public firstDataTimestamp: number = null;
    public lastDataTimestamp: number  = null;
    public lastBytes: number          = 0;
    public totalBytes: number         = 0;
    private _lastHr: [number, number] = null;

    constructor() {
        super({allowHalfOpen: false});
    }

    public _transform(chunk: any, encoding: string, cb: Function) {
        let len = 1;
        if (chunk instanceof Buffer || typeof chunk === "string") {
            len = chunk.length;
        }
        this.push(chunk, encoding);
        this._update(len);
        cb();
    }

    private _update(len: number) {
        this.totalBytes += len;
        this.lastBytes = len;

        const now = Date.now() / 1000;

        if (this._lastHr === null) {
            this._lastHr = process.hrtime();
            this.firstDataTimestamp = now;
            this.lastDataTimestamp  = now;
            return;
        }

        const diffHr = process.hrtime(this._lastHr);
        const diffInSeconds = (diffHr[0] * 1e9 + diffHr[1]) / 1e9;
        const currentSpeed     = calcSpeed(len, diffInSeconds);
        this.averageSpeed      = calcAverageSpeed(currentSpeed, this.averageSpeed);
        this.overallSpeed      = calcSpeed(this.totalBytes, now - this.firstDataTimestamp);
        this.lastSpeed         = currentSpeed;
        this.lastDataTimestamp = now;
        this._lastHr = process.hrtime();
    }
}

function calcAverageSpeed(currentSpeed: number, previousSpeed: number) {
    return Math.round((currentSpeed * 0.0001) + (previousSpeed * 0.9999));
}

function calcSpeed(len: number, time: number) {
    return Math.round(len / (time || 1));
}
