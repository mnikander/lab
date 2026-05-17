import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as G from "./grammar.ts";
import { make_cfg } from "./control-flow-graph.ts";

describe("must compute control flow graphs for programs with one function", () => {
  it("which is empty", () => {
    const program: G.Program = [[
      "func",
      ["result", ["local", "affine", "basic"]],
      [],
      [],
      [],
    ]];
    expect(make_cfg(program[0])).toEqual([]);
  });

  it("with one block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [["alloca", ["local", "affine", "basic"]]],
        [
          ["block", [
            ["return", 0],
          ]],
        ],
      ],
    ];
    expect(make_cfg(program[0])).toEqual([{ pred: [], succ: [] }]);
  });

  it("with two sequential blocks", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
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

  it("with four blocks which form a diamond", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
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

  it("with three blocks which split into two separate return blocks", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
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

  it("with an entry block, loop block, and final block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
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
