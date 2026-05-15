import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as G from "./grammar.ts";
import { check } from "./main.ts";

describe("naive programs", () => {
  it("must accept the empty program", () => {
    const program: G.Program = [];
    expect(check(program)).toBe(true);
  });

  it("must accept a main function which returns an integer", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [["alloca", ["local", "affine", "i64"]]],
        [["block", [
          ["define", 0],
          ["return", 0],
        ]]],
      ],
    ];
    expect(check(program)).toBe(true);
  });
});
