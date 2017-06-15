import {expect} from "chai";
import {PassThrough} from "stream";
import {StreamBeans} from "../../src/StreamBeans";
import {NullStream, sendDataOverTime} from "../helper";

describe("StreamBean", function() {
    this.timeout(5000);
    let simpleStream: PassThrough;
    let streamBean: StreamBeans;

    beforeEach(() => {
        simpleStream = new PassThrough();
        streamBean   = new StreamBeans();
        simpleStream.pipe(streamBean).pipe(NullStream());
    });

    it("should have initial values", () => {
        expect(streamBean.lastSpeed).to.eq(0);
        expect(streamBean.averageSpeed).to.eq(0);
        expect(streamBean.overallSpeed).to.eq(0);
        expect(streamBean.firstDataTimestamp).to.eq(null);
        expect(streamBean.lastDataTimestamp).to.eq(null);
        expect(streamBean.lastBytes).to.eq(0);
        expect(streamBean.totalBytes).to.eq(0);
    });

    it("should track bytes", (done) => {
        streamBean.on("end", () => {
            expect(streamBean.totalBytes).to.eq(20);
            expect(streamBean.lastBytes).to.eq(10);
            done();
        });

        simpleStream.write("1234567890");
        simpleStream.write("1234567890");
        simpleStream.end();
    });

    it("should track speeds", (done) => {

        streamBean.on("end", () => {
            expect(streamBean.lastSpeed).to.be.closeTo(40, 2);
            expect(streamBean.averageSpeed).to.be.closeTo(40, 2);
            done();
        });

        // 40 b/s
        sendDataOverTime(simpleStream, "0123456789", 5, 250, () => simpleStream.end());
    });

    it("should set overall speed", (done) => {
        streamBean.on("end", () => {
            expect(streamBean.overallSpeed).to.be.closeTo(60, 5);
            done();
        });

        // 40 B/s
        const stage1 = () => sendDataOverTime(simpleStream, "0123456789", 5, 250, stage2);
        // 80 B/s
        const stage2 = () => sendDataOverTime(simpleStream, "0123456789", 5, 125, finish);
        const finish = () => simpleStream.end();

        stage1();
    });
});
