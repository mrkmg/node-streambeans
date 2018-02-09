import {expect} from "chai";
import {createReadStream, createWriteStream, existsSync, readFileSync, ReadStream, unlinkSync} from "fs";
import {Writable} from "stream";
import {file} from "tempy";
import {StreamBeans} from "../../src";
import {makeFile} from "../helper";

describe("FS Streams", function () {
    this.timeout(5000);
    let inputFilePath: string;
    let outputFilePath: string;
    let inputSteam: ReadStream;
    let beans: StreamBeans;
    let outputStream: Writable;

    beforeEach(() => {
        inputFilePath = file();
        outputFilePath = file();
        makeFile(inputFilePath, 200000);
        inputSteam = createReadStream(inputFilePath);
        beans = new StreamBeans();
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
        beans.on("end", () => {
            const outputFileSize = readFileSync(outputFilePath, "UTF8").length;
            expect(beans.totalBytes).to.be.eq(200000);
            expect(outputFileSize).to.be.eq(200000);
            done();
        });

        inputSteam.pipe(beans).pipe(outputStream);
    });

    it("should have positive speeds", (done) => {
        beans.on("end", () => {
            expect(beans.averageSpeed).to.be.greaterThan(0);
            expect(beans.lastSpeed).to.be.greaterThan(0);
            expect(beans.overallSpeed).to.be.greaterThan(0);
            done();
        });

        inputSteam.pipe(beans).pipe(outputStream);
    });
});
