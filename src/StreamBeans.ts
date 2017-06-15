import {Transform} from "stream";

export class StreamBeans extends Transform {
    public lastSpeed: number          = 0;
    public averageSpeed: number       = 0;
    public overallSpeed: number       = 0;
    public firstDataTimestamp: number = null;
    public lastDataTimestamp: number  = null;
    public lastBytes: number          = 0;
    public totalBytes: number         = 0;

    constructor() {
        super({allowHalfOpen: false});
    }

    public _transform(chunk: any, encoding: string, cb: Function) {
        let len = 1;
        if (chunk instanceof Buffer || typeof chunk === "string") {
            len = chunk.length;
        }
        this._update(len);
        this.push(chunk, encoding);
        cb();
    }

    private _update(len: number) {
        this.totalBytes += len;
        this.lastBytes = len;

        const now = Date.now() / 1000;

        if (this.lastDataTimestamp === null) {
            this.firstDataTimestamp = now;
            this.lastDataTimestamp  = now;
            return;
        }

        const previousSpeed    = this.lastSpeed;
        const currentSpeed     = calcSpeed(len, now - this.lastDataTimestamp);
        this.averageSpeed      = calcAverageSpeed(currentSpeed, previousSpeed);
        this.overallSpeed      = calcSpeed(this.totalBytes, now - this.firstDataTimestamp);
        this.lastSpeed         = currentSpeed;
        this.lastDataTimestamp = now;
    }
}

function calcAverageSpeed(currentSpeed: number, previousSpeed: number) {
    return Math.round(currentSpeed * 0.01 + previousSpeed * 0.99);
}

function calcSpeed(len: number, time: number) {
    return Math.round(len / (time || 1));
}
