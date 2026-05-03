import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { define, free, Result, use } from "./lattice.ts";

describe("life-cycle", () => {
  it("define, free", () => {
    const defined: Result = define(["ok", "pre"]);
    const freed: Result = free(defined);
    expect(freed[0]).toEqual("ok");
    expect(freed[1]).toEqual("post");
  });

  it("define, use, free", () => {
    const defined: Result = define(["ok", "pre"]);
    const used: Result = use(defined);
    const freed: Result = free(used);
    expect(freed[0]).toEqual("ok");
    expect(freed[1]).toEqual("post");
  });

  it("define, define", () => {
    const defined: Result = define(["ok", "pre"]);
    const again: Result = define(defined);
    expect(again[0]).toEqual("error");
    expect(again[1]).toEqual("top");
  });
});
