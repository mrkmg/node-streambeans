StreamBeans
===========

[![Build Status](https://travis-ci.org/mrkmg/node-streambeans.svg?branch=master)](https://travis-ci.org/mrkmg/node-streambeans)

![StreamBeans!](http://i.imgur.com/tvscJrG.png)

A beancounter for your streams. Keep track of various metrics about a stream. It can tell you
instantaneous speed, average speed, overall speed, and duration of the of the stream. It also
works for streams in object mode.

## Installation

    npm install --save streambeans

## Quick Start

ES6


    import createStreamBeans from "streambeans";
    const beans = createStreamBeans(inStream, outStream);
    // At some later point
    console.log(beans.averageSpeed);


ES5

    var createStreamBeans = require("streambeans").createStreamBeans;
    var beans = createStreamBeans(inStream, outStream);
    // At some later point
    console.log(beans.averageSpeed);

## Usage

In order for the "beancounter" to do its work, you will need to pipe a stream through StreamBeans.

First, import the `StreamBeans` constructor (and optionally the `toHuman` helper function) and then
instantiate an instance of StreamBeans.

    const {StreamBeans, toHuman} = require("streambeans");
    const beans = new StreamBeans();

Then pipe an existing stream into stream beans.

    existingStream.pipe(beans);

You can then use the beans stream as you would have the original stream.

    beans.on("data", (chunk) => processChunk(chunk));

All the metrics of the stream are accessible from the beans object.

    console.log("Last Speed: " + toHuman(beans.lastSpeed) + "/s");
    console.log("Average Speed: " + toHuman(beans.averageSpeed) + "/s");
    console.log("Overall Speed: " + toHuman(beans.overallSpeed) + "/s");
    console.log("First Data Timestamp: " + beans.firstDataTimestamp);
    console.log("Last Data Timestamp: " + beans.lastDataTimestamp);
    console.log("Last Data Size: " + toHuman(beans.lastBytes));
    console.log("Total Data Size: " + toHuman(beans.totalBytes));

See the [example.js](./example.js) file for a working example of how to use StreamBeans.

## Available Metrics

| Metric                 | Description                                        |
|:-----------------------|:---------------------------------------------------|
| **lastSpeed**          | The instantaneous speed of the last chunk of data. |
| **averageSpeed**       | The average speed of the stream.                   |
| **overallSpeed**       | The overall speed of the stream.                   |
| **firstDataTimestamp** | UNIX Timestamp of the first chunk of data.         |
| **lastDataTimestamp**  | UNIX Timestamp of the last chunk of data.          |
| **lastBytes**          | Size of the last chunk of data.                    |
| **totalBytes**         | Size of all data trasferred through the stream.    |

## Extras

There is a helper function available to easily create a StreamBeans instance.

    const {createStreamBeans} = require("streambeans");
    const beans = createStreamBeans();

You can also skip the pipe step(s) and pass an input and/or output stream into `createStreamBeams`.

    const fileReadStream = createReadStream("./in.file");
    const fileWriteStream = createWriteStream("./out.file");
    const beans = createStreamBeans(fileReadStream, fileWriteStream);

You can also use this with an `objectMode` stream as well. Instead of counting bytes, it will count
the total objects and objects per second.

    const beans = new StreamBeans({objectMode: true});
    // or
    const beans = createStreamBeans(inStream, outStream, {objectMode: true});

The `toHuman` function will format the raw data (in bytes) into something more understandable
for human consumption.

You can adjust the number of seconds considered for the average speed. By default it is set to 5,
but can be set to any number you would prefer.

    const beans = new StreamBeans();
    beans.averageTimeFrame = 10; // Set average to calculate over 10 seconds


## Importing

Depending on what method you are using to handle your imports and what version of javascript you are
using, there are multiple available ways to import the `createStreamBeans` helper function.

    import createStreamBeans from "streambeans";
    const {createStreamBeans} = require("streambeans");
    const createStreamBeans = require("streambeans").createStreamBeans;

## Licence

Copyright 2017 Kevin Gravier

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
associated documentation files (the "Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the
following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
