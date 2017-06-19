import {expect} from "chai";
import {PassThrough} from "stream";
import {StreamBeans} from "../../src/StreamBeans";
import {NullStream, sendDataOverTime} from "../helper";

describe("StreamBeans", () => {
    let simpleStream: PassThrough;
    let beans: StreamBeans;

    beforeEach(() => {
        simpleStream = new PassThrough();
        beans        = new StreamBeans();
        simpleStream.pipe(beans).pipe(NullStream());
    });

    it("should have initial values", () => {
        expect(beans.lastSpeed).to.eq(0);
        expect(beans.averageSpeed).to.eq(0);
        expect(beans.overallSpeed).to.eq(0);
        expect(beans.firstDataTimestamp).to.eq(null);
        expect(beans.lastDataTimestamp).to.eq(null);
        expect(beans.lastBytes).to.eq(0);
        expect(beans.totalBytes).to.eq(0);
        expect(beans.averageTimeFrame).to.eq(5);
    });

    it("should track bytes", (done) => {
        beans.on("end", () => {
            expect(beans.totalBytes).to.eq(20);
            expect(beans.lastBytes).to.eq(10);
            done();
        });

        simpleStream.write("1234567890");
        simpleStream.write("1234567890");
        simpleStream.end();
    });

    it("should track speeds", (done) => {
        beans.on("end", () => {
            expect(beans.lastSpeed).to.be.closeTo(200, 50);
            expect(beans.averageSpeed).to.be.closeTo(200, 50);
            done();
        });

        // 200 b/s
        sendDataOverTime(simpleStream, "0123456789", 5, 50, () => simpleStream.end());
    });

    it("should set overall speed", (done) => {
        beans.on("end", () => {
            expect(beans.overallSpeed).to.be.closeTo(150, 20);
            done();
        });

        // 100 B/s
        const stage1 = () => sendDataOverTime(simpleStream, "0123456789", 5, 100, stage2);
        // 200 B/s
        const stage2 = () => sendDataOverTime(simpleStream, "0123456789", 5, 50, finish);
        const finish = () => simpleStream.end();

        stage1();
    });
});
