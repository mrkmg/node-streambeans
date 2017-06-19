import {expect} from "chai";
import {PassThrough} from "stream";
import {createStreamBeans,StreamBeans} from "../../src/index";
import createStreamBeansDefault from "../../src/index";
import {NullStream, StringStream} from "../helper";

describe("Helper Function", () => {

    it("is the same in default and named export", () => {
        expect(createStreamBeansDefault).to.eq(createStreamBeans);
    });

    it("works with 0 arguments", () => {
        const beans = createStreamBeans();

        expect(beans).to.be.instanceof(StreamBeans);
    });

    it("works with 1 argument", (done) => {
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

    it("works with 2 arguments", (done) => {
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

    it("works with 3 arguments", (done) => {
        const iStream = new PassThrough({objectMode: true});
        const beans = createStreamBeans(iStream, null, {objectMode: true});
        const data = {testObj: true};

        beans.once("data", (chunk) => {
            expect(data).to.eq(chunk);
            done();
        });

        iStream.write(data);
        iStream.end();
    });
});
