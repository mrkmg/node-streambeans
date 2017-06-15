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
    function StreamBeans() {
        var _this = _super.call(this, { allowHalfOpen: false }) || this;
        _this.lastSpeed = 0;
        _this.averageSpeed = 0;
        _this.overallSpeed = 0;
        _this.firstDataTimestamp = null;
        _this.lastDataTimestamp = null;
        _this.lastBytes = 0;
        _this.totalBytes = 0;
        return _this;
    }
    StreamBeans.prototype._transform = function (chunk, encoding, cb) {
        var len = 1;
        if (chunk instanceof Buffer || typeof chunk === "string") {
            len = chunk.length;
        }
        this._update(len);
        this.push(chunk, encoding);
        cb();
    };
    StreamBeans.prototype._update = function (len) {
        this.totalBytes += len;
        this.lastBytes = len;
        var now = Date.now() / 1000;
        if (this.lastDataTimestamp === null) {
            this.firstDataTimestamp = now;
            this.lastDataTimestamp = now;
            return;
        }
        var previousSpeed = this.lastSpeed;
        var currentSpeed = calcSpeed(len, now - this.lastDataTimestamp);
        this.averageSpeed = calcAverageSpeed(currentSpeed, previousSpeed);
        this.overallSpeed = calcSpeed(this.totalBytes, now - this.firstDataTimestamp);
        this.lastSpeed = currentSpeed;
        this.lastDataTimestamp = now;
    };
    return StreamBeans;
}(stream_1.Transform));
exports.StreamBeans = StreamBeans;
function calcAverageSpeed(currentSpeed, previousSpeed) {
    return Math.round(currentSpeed * 0.01 + previousSpeed * 0.99);
}
function calcSpeed(len, time) {
    return Math.round(len / (time || 1));
}
