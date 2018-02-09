import {expect} from "chai";
import {toHuman} from "../../src";

describe("toHuman()", () => {
    it("should convert bytes to readable", () => {
        expect(toHuman(1000)).to.eq("1 kB");
    });
});
