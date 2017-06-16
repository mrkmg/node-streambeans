import {expect} from "chai";
import {PassThrough} from "stream";
import createStreamBeans, {StreamBeans} from "../../src/index";
import {NullStream, StringStream} from "../helper";

describe("Helper Function", function () {
    this.timeout(5000);

    it("0 arguments", () => {
        const beans = createStreamBeans();

        expect(beans).to.be.instanceof(StreamBeans);
    });

    it("1 argument", (done) => {
        const iStream    = new PassThrough();
        const nullStream = NullStream();
        const beans      = createStreamBeans(iStream);

        beans.pipe(nullStream);

        beans.on("end", () => {
            expect(beans.totalBytes).to.eq(1);
            done();
        });

        iStream.write("0");
        iStream.end();
    });

    it("2 arguments", (done) => {
        const iStream = new PassThrough();
        const oStream = StringStream();
        const beans   = createStreamBeans(iStream, oStream);

        beans.on("end", () => {
            expect(oStream.string).to.eq("ABCDEF");
            done();
        });

        iStream.write("ABCDEF");
        iStream.end();
    });
});
