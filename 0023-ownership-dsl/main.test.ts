import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as G from "./grammar.ts";
import { check } from "./main.ts";

describe("naive programs", () => {
  it("must accept the empty program", () => {
    const program: G.Program = [];
    expect(check(program)).toBe(true);
  });

  it("must accept a function which returns a defined register", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [["alloca", ["local", "affine", "i64"]]],
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });

  it("must reject a function which does not allocate all of its registers", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
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
    expect(check(program)).toBe(true);
  });

  it("must reject a main function which returns a dropped register", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [["alloca", ["local", "affine", "i64"]]],
        [
          ["block", [
            ["define", 0],
            ["drop", 0],
            ["return", 0], // error: return-after-drop
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });
});

describe("jump", () => {
  it("must accept use of a defined variable in another block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1]],
          ]],
          ["block", [
            ["use", 0],
            ["drop", 0],
            ["define", 1],
            ["return", 1],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });

  it("must reject use of a dropped variable in another block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["drop", 0],
            ["branch", [1]],
          ]],
          ["block", [
            ["use", 0], // error: use-after-drop
            ["define", 1],
            ["return", 1],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });
});

describe("split and join", () => {
  it("must accept use of defined variables in other blocks", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["use", 0],
            ["define", 1],
            ["use", 1],
            ["branch", [3]],
          ]],
          ["block", [
            ["use", 0],
            ["define", 2],
            ["use", 2],
            ["branch", [3]],
          ]],
          ["block", [
            ["use", 0],
            ["define", 3],
            ["use", 3],
            ["drop", 3],
            ["return", 0],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });
  it("must reject use of undefined/dropped variables in another block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["use", 0],
            ["drop", 0],
            ["define", 1],
            ["use", 1],
            ["branch", [3]],
          ]],
          ["block", [
            ["use", 0],
            ["define", 2],
            ["use", 2],
            ["branch", [3]],
          ]],
          ["block", [
            ["use", 0], // error: possible use-after-drop
            ["drop", 0], // error: possible use-after-drop
            ["use", 1], // error: possible use-before-define
            ["use", 2], // error: possible use-before-define
            ["return", 0], // error: possible return-after-drop
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });
});

describe("multiple returns", () => {
  it("must accept use of defined variables in multiple returns", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["use", 0],
            ["define", 1],
            ["use", 1],
            ["return", 1],
          ]],
          ["block", [
            ["use", 0],
            ["define", 2],
            ["use", 2],
            ["return", 2],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });

  it("must reject programs with an error on any of its return paths", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["use", 0],
            ["define", 1],
            ["use", 1],
            ["use", 2], // error: use-before-define
            ["return", 1],
          ]],
          ["block", [
            ["use", 0],
            ["define", 2],
            ["use", 1], // error: use-before-define
            ["use", 2],
            ["return", 2],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });
});

describe("loop", () => {
  it("must accept use of defined variables in loops", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1]],
          ]],
          ["block", [
            ["use", 0],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["use", 0],
            ["drop", 0],
            ["define", 1],
            ["use", 1],
            ["drop", 1],
            ["return", 1],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });

  it("must accept define-use-drop inside loops", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["branch", [1]],
          ]],
          ["block", [
            ["define", 0],
            ["use", 0],
            ["drop", 0],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["define", 1],
            ["return", 1],
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });

  it("must reject use of undefined/dropped variables in loops", () => {
    const program: G.Program = [
      [
        "func",
        ["result", "i64"],
        [],
        [
          ["alloca", ["local", "affine", "i64"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1]],
          ]],
          ["block", [
            ["use", 0], // error: possible use-after-drop
            ["drop", 0], // error: possible double-drop
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["use", 0], // error: possible use-after-drop
            ["drop", 0], // error: possible use-after-drop
            ["return", 0], // error: possible return-after-drop
          ]],
        ],
      ],
    ];
    expect(check(program)).toBe(true);
  });
});
