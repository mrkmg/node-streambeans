import {expect} from "chai";
import {createReadStream, createWriteStream, existsSync, ReadStream, unlinkSync} from "fs";
import {Writable} from "stream";
import {file} from "tempy";
import {StreamBeans} from "../../src/StreamBeans";
import {makeFile} from "../helper";

describe("FS Streams", function() {
    this.timeout(5000);
    let inputFilePath: string;
    let outputFilePath: string;
    let inputSteam: ReadStream;
    let streamBean: StreamBeans;
    let outputStream: Writable;

    beforeEach(() => {
        inputFilePath  = file();
        outputFilePath = file();
        makeFile(inputFilePath, 200000);
        inputSteam = createReadStream(inputFilePath);
        streamBean = new StreamBeans();
        outputStream = createWriteStream(outputFilePath);
    });

    afterEach(() => {
        inputSteam.close();
        if (existsSync(inputFilePath)) {
            unlinkSync(inputFilePath);
        }
        if (existsSync(outputFilePath)) {
            unlinkSync(outputFilePath);
        }
    });

    it("should count size of file", (done) => {
        streamBean.on("end", () => {
            expect(streamBean.totalBytes).to.be.eq(200000);
            done();
        });

        inputSteam.pipe(streamBean).pipe(outputStream);
    });

    it("should have positive speeds", (done) => {
        streamBean.on("end", () => {
            expect(streamBean.averageSpeed).to.be.greaterThan(0);
            expect(streamBean.lastSpeed).to.be.greaterThan(0);
            expect(streamBean.overallSpeed).to.be.greaterThan(0);
            done();
        });

        inputSteam.pipe(streamBean).pipe(outputStream);
    });
});
