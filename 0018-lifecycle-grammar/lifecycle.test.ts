import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { define, free, get_state, is_ok, Result, use } from "./lattice.ts";

describe("life-cycle", () => {
  it("define, define", () => {
    const result: Result = define(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, free", () => {
    const result: Result = free(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("post");
  });

  it("define, use, free", () => {
    const result: Result = free(use(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("post");
  });
});
