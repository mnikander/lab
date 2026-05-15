import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as G from "./grammar.ts";
import { check } from "./main.ts";
import { make_cfg } from "./control-flow-graph.ts";

describe("programs with one function", () => {
  it("must compute CFG for the empty program", () => {
    const program: G.Program = [];
    expect(make_cfg(program[0])).toEqual([]);
  });

  it("must compute CFG for a function with one block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [["alloca", ["local", "affine", "i64"]]],
        [
          ["block", [
            ["return", 0],
          ]],
        ],
      ],
    ];
    expect(make_cfg(program[0])).toEqual([{ pred: [], succ: [] }]);
  });

  it("must compute CFG for a function with two sequential blocks", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [],
        [
          ["block", [
            ["branch", [1]],
          ]],
          ["block", [
            ["return", 1],
          ]],
        ],
      ],
    ];
    expect(make_cfg(program[0])).toEqual([
      { pred: [], succ: [1] },
      { pred: [0], succ: [] },
    ]);
  });

  it("must compute CFG for a function with four blocks which form a diamond", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [],
        [
          ["block", [
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["branch", [3]],
          ]],
          ["block", [
            ["branch", [3]],
          ]],
          ["block", [
            ["return", 0],
          ]],
        ],
      ],
    ];
    expect(make_cfg(program[0])).toEqual([
      { pred: [], succ: [1, 2] },
      { pred: [0], succ: [3] },
      { pred: [0], succ: [3] },
      { pred: [1, 2], succ: [] },
    ]);
  });

  it("must compute CFG for a function with three blocks which split into two separate return blocks", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [],
        [
          ["block", [
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["return", 1],
          ]],
          ["block", [
            ["return", 2],
          ]],
        ],
      ],
    ];
    expect(make_cfg(program[0])).toEqual([
      { pred: [], succ: [1, 2] },
      { pred: [0], succ: [] },
      { pred: [0], succ: [] },
    ]);
  });

  it("must compute CFG for a function with an entry block, loop block, and final block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [],
        [
          ["block", [
            ["branch", [1]],
          ]],
          ["block", [
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["return", 1],
          ]],
        ],
      ],
    ];
    expect(make_cfg(program[0])).toEqual([
      { pred: [], succ: [1] },
      { pred: [0, 1], succ: [1, 2] },
      { pred: [1], succ: [] },
    ]);
  });
});
