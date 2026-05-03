import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { define, free, State, Success, use } from "./lattice.ts";

describe("life-cycle", () => {
  it("define, free", () => {
    const defined: [State, Success] = define("pre");
    const freed: [State, Success] = free(defined[0]);
    expect(freed[0]).toEqual("post");
    expect(freed[1][0]).toEqual("ok");
  });

  it("define, use, free", () => {
    const defined: [State, Success] = define("pre");
    const used: [State, Success] = use(defined[0]);
    const freed: [State, Success] = free(used[0]);
    expect(freed[0]).toEqual("post");
    expect(freed[1][0]).toEqual("ok");
  });

  it("define, define", () => {
    const defined: [State, Success] = define("pre");
    const again: [State, Success] = define(defined[0]);
    expect(again[0]).toEqual("top");
    expect(again[1][0]).toEqual("error");
  });
});
