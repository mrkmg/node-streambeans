import {DuplexOptions, Transform} from "stream";

export class StreamBeans extends Transform {
    /**
     * The last instantaneous speed measured
     * @type {number}
     */
    public lastSpeed: number    = 0;

    /**
     * The average speed over the last {averageTimeFrame} seconds
     * @type {number}
     */
    public averageSpeed: number = 0;

    /**
     * The average speed of the entire streams history
     * @type {number}
     */
    public overallSpeed: number = 0;

    /**
     * Unix timestamp of first detected data
     * @type {number}
     */
    public firstDataTimestamp: number = null;

    /**
     * Unix timestamp of the last detected data
     * @type {number}
     */
    public lastDataTimestamp: number  = null;

    /**
     * Number of bytes in the last detected chunk of data
     * @type {number}
     */
    public lastBytes: number  = 0;

    /**
     * Total number of bytes transferred in the stream
     * @type {number}
     */
    public totalBytes: number = 0;

    /**
     * Number of seconds to calculate for {averageSpeed}
     * @type {number}
     */
    public averageTimeFrame: number = 5;

    private _lastHr: [number, number] = null;
    private _isObjectMode: boolean;


    constructor(opts: DuplexOptions = {allowHalfOpen: false}) {
        super(opts);
        this._isObjectMode = opts.hasOwnProperty("objectMode") && opts.objectMode;
    }

    public _transform(chunk: any, encoding: string, cb: Function) {
        const len = this._isObjectMode ? 1 : chunk.length;
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

    private _calculateAverageSpeed(currentSpeed: number, secondsPassed: number) {
        if (this.lastDataTimestamp - this.firstDataTimestamp < this.averageTimeFrame) {
            this.averageSpeed = this.overallSpeed;
        } else {
            // The factor calculated from desired average time frame. The max for this is 1.
            const factor      = Math.min(secondsPassed / this.averageTimeFrame, 1);
            this.averageSpeed = Math.round((currentSpeed * factor) + (this.averageSpeed * (1 - factor)));
        }
    }
}

function calcSpeed(len: number, time: number) {
    return Math.round(len / (time || 1));
}
