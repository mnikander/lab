import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as G from "./grammar.ts";
import { all_good, check_function } from "./main.ts";
import { State } from "./lattice.ts";

describe.skip("alloca", () => {
  it("must reject a function which does not allocate all of its registers", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });

  it("must reject a function allocates more registers than it needs", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]], // error: unused register
        ],
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});

describe.skip("annotations", () => {
  it("must reject a function which declares the scope of the result incorrectly", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]], // error: does not match the register's annotation
        [],
        [["alloca", ["global", "linear", "basic"]]],
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });

  it("must reject a function which declares the substructure of the result incorrectly", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]], // error: does not match the register's annotation
        [],
        [["alloca", ["global", "linear", "basic"]]],
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });

  it("must reject a function which declares the type of the result incorrectly", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "pointer"]], // error: does not match the register's annotation
        [],
        [["alloca", ["local", "affine", "basic"]]], // test 'pointer := basic' not 'basic := pointer' since returning a local-pointer is always a dangling-pointer error
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});
