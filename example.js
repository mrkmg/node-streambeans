const StreamBeans = require("./lib");
const createStreamBeans = StreamBeans.default;
const toHuman = StreamBeans.toHuman;
const PassThrough = require("stream").PassThrough;
const Writable = require("stream").Writable;

// Get some streams
const inputStream  = new PassThrough();
const outputStream = new Writable({write: (d, e, c) => c()});

// Create a StreamBeans
const streamBeans = createStreamBeans();

// Pipe the inputStream to the outputStream through StreamBeams
inputStream.pipe(streamBeans).pipe(outputStream);

// Every one second, output some details about the stream
const displayInterval = setInterval(() => {
    console.log("Last Speed: " + toHuman(streamBeans.lastSpeed) + "/s");
    console.log("Average Speed: " + toHuman(streamBeans.averageSpeed) + "/s");
    console.log("Overall Speed: " + toHuman(streamBeans.overallSpeed) + "/s");
    console.log("First Data Timestamp: " + streamBeans.firstDataTimestamp);
    console.log("Last Data Timestamp: " + streamBeans.lastDataTimestamp);
    console.log("Last Data Size: " + toHuman(streamBeans.lastBytes));
    console.log("Total Data Size: " + toHuman(streamBeans.totalBytes));
    console.log("=========================================");
}, 500);

// Once the stream ends, stop the output
streamBeans.on("end", () => clearInterval(displayInterval));

let i = 0;
let max = 100;
const runData = () => {
    if (++i > max) {
        inputStream.end();
        return;
    }
    inputStream.write("0".repeat(Math.round(Math.random() * 100)), () => {
        setTimeout(runData, Math.random() * 1000);
    });
};


runData();
