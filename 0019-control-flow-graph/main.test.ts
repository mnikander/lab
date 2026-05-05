import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as HIGH from "./grammar.ts";

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
            terminator: [null, "jump", "@second"],
          },
          {
            name: "@first",
            phis: [],
            lines: [
              ["%1", "constant", { value: 11 }],
            ],
            terminator: [null, "return", "%1"],
          },
          {
            name: "@second",
            phis: [],
            lines: [
              ["%2", "constant", { value: 13 }],
            ],
            terminator: [null, "return", "%2"],
          },
        ],
      },
    ];
    expect(input).toBeDefined();
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
    expect(input).toBeDefined();
  });
});
