import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as HIGH from "./grammar.ts";
import { CFG, make_cfg } from "./main.ts";

describe("unit testing", () => {
  it("jump and return", () => {
    //
    //      Entry
    //        |
    //        A     B
    //
    // Note: B is unreachable
    //
    const _text: string = `
function @main [] -> Int

  block @entry
    jump @bravo

  block @alpha
    %1 = constant Int 11
    return Int %1

  block @bravo
    %2 = constant Int 13
    return Int %2
`;

    const input: HIGH.Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            phis: [],
            lines: [],
            terminator: [null, "jump", "@bravo"],
          },
          {
            name: "@alpha",
            phis: [],
            lines: [
              ["%1", "constant", { value: 11 }],
            ],
            terminator: [null, "return", "%1"],
          },
          {
            name: "@bravo",
            phis: [],
            lines: [
              ["%2", "constant", { value: 13 }],
            ],
            terminator: [null, "return", "%2"],
          },
        ],
      },
    ];
    const result: CFG = make_cfg(input[0]);
    const expected: CFG = [
      { name: "@entry", predecessors: [], successors: [2] },
      { name: "@alpha", predecessors: [], successors: [] },
      { name: "@bravo", predecessors: [0], successors: [] },
    ];

    expect(input).toBeDefined();
    expect(result).toEqual(expected);
  });

  it("jump, branch, phi node, and return", () => {
    //
    //      Entry
    //        |
    //        A
    //      / |
    //     B  |
    //      \ |
    //        C
    //
    //
    const _text: string = `
function @main [] -> Int

  block @entry
    jump @alpha

  block @alpha
    %a = constant Int 11
    %condition = constant Int 1
    branch %condition @bravo @charlie

  block @bravo
    %b = constant Int 13
    jump @charlie

  block @charlie
    %result = phi Int [@alpha, %a] [@bravo, %b]
    return Int %result
`;

    const input: HIGH.Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            phis: [],
            lines: [],
            terminator: [null, "jump", "@alpha"],
          },
          {
            name: "@alpha",
            phis: [],
            lines: [
              ["%a", "constant", { value: 11 }],
              ["%condition", "constant", { value: 1 }],
            ],
            terminator: [null, "branch", "%condition", [
              "@bravo",
              "@charlie",
            ]],
          },
          {
            name: "@bravo",
            phis: [],
            lines: [
              ["%b", "constant", { value: 13 }],
            ],
            terminator: [null, "jump", "@charlie"],
          },
          {
            name: "@charlie",
            phis: [
              ["%result", "phi", [["@alpha", "%a"], [
                "@bravo",
                "%b",
              ]]],
            ],
            lines: [],
            terminator: [null, "return", "%result"],
          },
        ],
      },
    ];
    const result: CFG = make_cfg(input[0]);
    const expected: CFG = [
      { name: "@entry", predecessors: [], successors: [1] },
      { name: "@alpha", predecessors: [0], successors: [2, 3] },
      { name: "@bravo", predecessors: [1], successors: [3] },
      { name: "@charlie", predecessors: [1, 2], successors: [] },
    ];

    expect(input).toBeDefined();
    expect(result).toEqual(expected);
  });
});
