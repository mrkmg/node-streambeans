"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var StreamBeans = (function (_super) {
    __extends(StreamBeans, _super);
    function StreamBeans(opts) {
        if (opts === void 0) { opts = { allowHalfOpen: false }; }
        var _this = _super.call(this, opts) || this;
        _this.lastSpeed = 0;
        _this.averageSpeed = 0;
        _this.overallSpeed = 0;
        _this.firstDataTimestamp = null;
        _this.lastDataTimestamp = null;
        _this.lastBytes = 0;
        _this.totalBytes = 0;
        _this.averageTimeFrame = 5;
        _this._lastHr = null;
        _this._isObjectMode = opts.hasOwnProperty("objectMode") && opts.objectMode;
        return _this;
    }
    StreamBeans.prototype._transform = function (chunk, encoding, cb) {
        var len = this._isObjectMode ? 1 : chunk.length;
        this.push(chunk, encoding);
        this._update(len);
        cb();
    };
    StreamBeans.prototype._update = function (len) {
        this.totalBytes += len;
        this.lastBytes = len;
        var now = Date.now() / 1000;
        if (this._lastHr === null) {
            this._lastHr = process.hrtime();
            this.firstDataTimestamp = now;
            this.lastDataTimestamp = now;
            return;
        }
        var diffHr = process.hrtime(this._lastHr);
        var diffInSeconds = (diffHr[0] * 1e9 + diffHr[1]) / 1e9;
        var currentSpeed = calcSpeed(len, diffInSeconds);
        this._calculateAverageSpeed(currentSpeed, diffInSeconds);
        this.overallSpeed = calcSpeed(this.totalBytes, now - this.firstDataTimestamp);
        this.lastSpeed = currentSpeed;
        this.lastDataTimestamp = now;
        this._lastHr = process.hrtime();
    };
    StreamBeans.prototype._calculateAverageSpeed = function (currentSpeed, secondsPassed) {
        if (this.averageSpeed === 0) {
            this.averageSpeed = currentSpeed;
        }
        else {
            var factor = Math.max(secondsPassed / this.averageTimeFrame, 1);
            this.averageSpeed = Math.round((currentSpeed * factor) + (this.averageSpeed * (1 - factor)));
        }
    };
    return StreamBeans;
}(stream_1.Transform));
exports.StreamBeans = StreamBeans;
function calcSpeed(len, time) {
    return Math.round(len / (time || 1));
}
