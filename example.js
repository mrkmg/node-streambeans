const {createStreamBeans, toHuman}  = require("./lib");
const {PassThrough, Writable} = require("stream");
const readline                = require("readline");

// Create an input stream. We will write data to this once everything is setup
const inputStream  = new PassThrough();
// Create a null stream to output to. This will throw away any data it receives
const outputStream = new Writable({write: (d, e, c) => c()});
// Create out beancounter
const beans = createStreamBeans(inputStream, outputStream);
// Adjust the beans average timeframe to 8 seconds
beans.averageTimeFrame = 8;

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

// Once the stream ends, stop the updates, and output an overall
beans.on("end", () => {
    clearInterval(displayInterval);
    readline.clearScreenDown(process.stdout);
    console.log("Total Time:   ", (beans.lastDataTimestamp - beans.firstDataTimestamp) + "s");
    console.log("Total Bytes:  ", toHuman(beans.totalBytes));
    console.log("Overall Speed:", toHuman(beans.overallSpeed) + "/s");
    console.log("=========================================");
});

// Write a "random" amount of every 50 milliseconds
const dataWriteInterval = setInterval(() => {
    inputStream.write("0".repeat(Math.round(Math.random() * 100)));
}, 50);

// Stop the writing and end the stream after 10 seconds
setTimeout(() => {
    clearInterval(dataWriteInterval);
    inputStream.end();
}, 10000);
