"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var StreamBeans_1 = require("./StreamBeans");
var prettyBytes = require("pretty-bytes");
__export(require("./StreamBeans"));
function toHuman(bytes) {
    return prettyBytes(bytes);
}
exports.toHuman = toHuman;
function createStreamBeans(inStream, outStream, opts) {
    var beans = new StreamBeans_1.StreamBeans(opts);
    if (inStream) {
        inStream.pipe(beans);
    }
    if (outStream) {
        beans.pipe(outStream);
    }
    return beans;
}
exports.createStreamBeans = createStreamBeans;
exports.default = createStreamBeans;
