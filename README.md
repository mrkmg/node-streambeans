StreamBeans
===========

![Build Status](https://travis-ci.org/mrkmg/node-streambeans.png?branch=master)

A beancounter for your streams. Keep track of various metrics about a stream.

## Installation

```
npm install --save streambeans
```

## Usage

```ecmascript 6
import {StreamBean, toHuman} from "streambeans";

// Get some streams
const inputStream = /* some stream */;
const outputStream = /* some stream */;

// Create a StreamBeans stream
const streamBeans = new StreamBean();

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
}, 1000);

// Once the stream ends, stop the output
streamBeans.on("end", () => clearInterval(displayInterval));
````

## Properties

- **lastSpeed** - The instantaneous speed of the last chunk of data.
- **averageSpeed** - The average speed of the stream.
- **overallSpeed** - The overall speed of the stream.
- **firstDataTimestamp** - A seconds based timestamp of when the first chunk of data was detected.
- **lastDataTimestamp** - A seconds based timestamp of when the last chunk of data was detected.
- **lastBytes** - The size of the last chunk of data.
- **totalBytes** - The total size of data transferred.

## Extras

There is a default export available to easily create a StreamBeans object from another stream.

``` ecmascript 6
import createStreamBeans from "streambeans";
import {createReadStream} from "fs";

const fileReadStream = createReadStream("./file");
const streamBeans = createStreamBeans(fileReadStream);
````

The `toHuman` function will format the raw data into something more understandable
for human consumption.

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
