import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Program, Register } from "./grammar.ts";
import { dataflow } from "./dataflow.ts";
import { Result } from "./lattice.ts";

describe("life-cycle for a single basic block", () => {
  it("must accept an empty block", () => {
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

  it("must accept define", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            lines: [
              ["define", "%x"],
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
    const maybe_error: undefined | [Register, Result] = dataflow(program);
    expect(maybe_error).toBe(undefined);
  });

  it("must accept define-use", () => {
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

  it("must accept define-use-free", () => {
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
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
    const maybe_error: undefined | [Register, Result] = dataflow(program);
    expect(maybe_error).toBe(undefined);
  });

  it("must reject use-before-define", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            lines: [
              ["use", "%x"],
              ["define", "%x"],
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
      "use-before-define",
    ]]);
  });

  it("must reject use-after-free", () => {
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

  it("must reject double-define", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry",
            lines: [
              ["define", "%x"],
              ["define", "%x"],
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
      "define-after-define",
    ]]);
  });

  it("must reject double-free", () => {
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
