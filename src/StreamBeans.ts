import {Transform} from "stream";

export class StreamBeans extends Transform {
    public lastSpeed: number          = 0;
    public averageSpeed: number       = 0;
    public overallSpeed: number       = 0;
    public firstDataTimestamp: number = null;
    public lastDataTimestamp: number  = null;
    public lastBytes: number          = 0;
    public totalBytes: number         = 0;
    public averageTimeFrame: number   = 5;
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
            this._lastHr            = process.hrtime();
            this.firstDataTimestamp = now;
            this.lastDataTimestamp  = now;
            return;
        }

        const diffHr        = process.hrtime(this._lastHr);
        const diffInSeconds = (diffHr[0] * 1e9 + diffHr[1]) / 1e9;
        const currentSpeed  = calcSpeed(len, diffInSeconds);

        this._calculateAverageSpeed(currentSpeed, diffInSeconds);

        this.overallSpeed      = calcSpeed(this.totalBytes, now - this.firstDataTimestamp);
        this.lastSpeed         = currentSpeed;
        this.lastDataTimestamp = now;
        this._lastHr           = process.hrtime();
    }

    private _calculateAverageSpeed(currentSpeed: number, secondsPassed: any) {
        if (this.averageSpeed === 0) {
            this.averageSpeed = currentSpeed;
        } else {
            const factor      = secondsPassed / this.averageTimeFrame;
            this.averageSpeed = Math.round((currentSpeed * factor) + (this.averageSpeed * (1 - factor)));
        }
    }
}

function calcSpeed(len: number, time: number) {
    return Math.round(len / (time || 1));
}
