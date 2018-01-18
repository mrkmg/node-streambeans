import {expect} from "chai";
import {PassThrough} from "stream";
import {StreamBeans} from "../../src/StreamBeans";
import {NullStream, sendDataOverTime} from "../helper";

describe("StreamBeans - Object Mode", () => {
    let simpleStream: PassThrough;
    let beans: StreamBeans;

    beforeEach(() => {
        simpleStream = new PassThrough({objectMode: true});
        beans        = new StreamBeans({objectMode: true});
        simpleStream.pipe(beans).pipe(NullStream(true));
    });

    it("should track counts", (done) => {
        beans.on("end", () => {
            expect(beans.totalBytes).to.eq(2);
            expect(beans.lastBytes).to.eq(1);
            done();
        });

        simpleStream.write({testObject: true, string: "abc"});
        simpleStream.write({testObject: true, string: "abc"});
        simpleStream.end();
    });

    it("should track counts/s", (done) => {
        beans.on("end", () => {
            expect(beans.lastSpeed).to.be.closeTo(20, 5);
            expect(beans.averageSpeed).to.be.closeTo(20, 5);
            done();
        });

        // 20 objects per second
        sendDataOverTime(simpleStream, {testObject: true, string: "abc"}, 10, 50, () => simpleStream.end());
    });

    it("should track overall counts/s", (done) => {
        beans.on("end", () => {
            expect(beans.overallSpeed).to.be.closeTo(15, 2);
            done();
        });

        // 10 objects per second
        const stage1 = () => sendDataOverTime(simpleStream, {testObject: true, string: "abc"}, 5, 100, stage2);
        // 20 objects per second
        const stage2 = () => sendDataOverTime(simpleStream, {testObject: true, string: "abc"}, 5, 50, finish);
        const finish = () => simpleStream.end();

        stage1();
    });
});
