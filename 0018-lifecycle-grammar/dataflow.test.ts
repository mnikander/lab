import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Program, Register } from "./grammar.ts";
import { dataflow } from "./dataflow.ts";
import { Result } from "./lattice.ts";

describe("life-cycle", () => {
  it("empty program", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          { name: "@entry", lines: [], terminator: ["return"] },
        ],
      },
    ];
    const maybe_error: undefined | [Register, Result] = dataflow(program);
    expect(maybe_error).toBe(undefined);
  });

  it("simple program", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            lines: [
              ["define", "%x"],
              ["use", "%x"],
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
    const maybe_error: undefined | [Register, Result] = dataflow(program);
    expect(maybe_error).toBe(undefined);
  });

  it("use-after-free", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            lines: [
              ["define", "%x"],
              ["use", "%x"],
              ["free", "%x"],
              ["use", "%x"],
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
    const maybe_error: undefined | [Register, Result] = dataflow(program);
    expect(maybe_error).toEqual(["%x", [
      "error",
      "top",
      "use-after-free",
    ]]);
  });

  it("double-free", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            lines: [
              ["define", "%x"],
              ["use", "%x"],
              ["free", "%x"],
              ["free", "%x"],
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
    const maybe_error: undefined | [Register, Result] = dataflow(program);
    expect(maybe_error).toEqual(["%x", [
      "error",
      "top",
      "free-after-free",
    ]]);
  });
});
