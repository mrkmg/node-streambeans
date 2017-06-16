const {StreamBeans, toHuman} = require("./lib");
const PassThrough            = require("stream").PassThrough;
const Writable               = require("stream").Writable;
const readline               = require("readline");

// Create an input stream. We will write data to this once everything is setup
const inputStream  = new PassThrough();
// Create a null stream to output to. This will throw any data it receives
const outputStream = new Writable({write: (d, e, c) => c()});

// Create a StreamBeans
const beans = new StreamBeans();

// Adjust the beans average timeframe to 8 seconds
beans.averageTimeFrame = 8;

// Pipe the inputStream to the outputStream through our bean counter
inputStream.pipe(beans).pipe(outputStream);

// Once every half a second, output to the screen all the streams metrics
const displayInterval = setInterval(() => {
    // Clear everything below cursor
    readline.clearScreenDown(process.stdout);

    // Output metrics
    console.log("Last Speed:           " + toHuman(beans.lastSpeed) + "/s");
    console.log("Average Speed:        " + toHuman(beans.averageSpeed) + "/s");
    console.log("Overall Speed:        " + toHuman(beans.overallSpeed) + "/s");
    console.log("First Data Timestamp: " + beans.firstDataTimestamp);
    console.log("Last Data Timestamp:  " + beans.lastDataTimestamp);
    console.log("Last Data Size:       " + toHuman(beans.lastBytes));
    console.log("Total Data Size:      " + toHuman(beans.totalBytes));
    console.log("=========================================");

    // Move the cursor to the top line to prep for next interval
    readline.moveCursor(process.stdout, 0, -8);
}, 500);

// Once the stream ends, stop the output
beans.on("end", () => clearInterval(displayInterval));

// Write a "random" amount of every 50 milliseconds
const dataWriteInterval = setInterval(() => {
    inputStream.write("0".repeat(Math.round(Math.random() * 100)));
}, 50);

// Stop the writing and end the stream after 10 seconds
setTimeout(() => {
    clearInterval(dataWriteInterval);
    inputStream.end();
}, 10000);
