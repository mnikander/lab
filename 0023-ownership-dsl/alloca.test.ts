import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as G from "./grammar.ts";
import { check_function } from "./main.ts";

describe.skip("alloca issues", () => {
  it("must reject a function which does not allocate all of its registers", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "i64"]],
        [],
        [], // error: missing alloca
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    expect(check_function(program[0])).toBe(false);
  });

  it("must reject a function allocates more registers than it needs", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "i64"]],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]], // error: unused register
        ],
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    expect(check_function(program[0])).toBe(false);
  });
});
