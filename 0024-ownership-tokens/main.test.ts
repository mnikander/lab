import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import * as G from "./grammar.ts";
import { compute_dependencies, DependencyGraph } from "./main.ts";
import { Graph } from "./graph.ts";
import { make_cfg } from "./control-flow-graph.ts";

function int(): G.Token {
  return ["token", "local", "cloneable", "no_drop", ["int"]];
}

function borrow(token: G.Token): G.Token {
  return ["token", "local", "cloneable", "no_drop", ["borrowed", token]];
}

function own(token: G.Token): G.Token {
  return ["token", "local", "cloneable", "no_drop", ["owned", token]];
}

function caller(token: G.Token): G.Token {
  token[1] = "caller";
  return token;
}

function unique(token: G.Token): G.Token {
  token[2] = "unique";
  return token;
}

function must_drop(token: G.Token): G.Token {
  token[3] = "must_drop";
  return token;
}

describe("functions with a single block", () => {
  it("return a register", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [["alloca", int()]],
      [["block", [
        ["assign", 0, "constant"],
        ["return", 0],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("return a linear register", () => {
    const fun: G.Function = [
      "func",
      ["result", unique(must_drop(int()))],
      [],
      [["alloca", unique(must_drop(int()))]],
      [["block", [
        ["assign", 0, "constant"],
        ["return", 0],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("add two arguments", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [
        ["param", int()],
        ["param", int()],
      ],
      [
        ["alloca", int()],
      ],
      [["block", [
        ["assign", 2, "add", 0, 1],
        ["return", 2],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
      [],
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });

  it("identity function on integers", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [["param", int()]],
      [],
      [["block", [
        ["return", 0],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("identity function on borrows", () => {
    const fun: G.Function = [
      "func",
      ["result", borrow(int())],
      [["param", caller(borrow(caller(int())))]], // allowed to escape
      [],
      [["block", [
        ["return", 0],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [["target_of", ["token", 0]]],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });
});

describe("jump", () => {
  it("with use of a register", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["alloca", int()],
        ["alloca", int()],
      ],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1]],
        ]],
        ["block", [
          ["drop", 0],
          ["assign", 1, "constant"],
          ["return", 1],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(2);
    // expect(actual).toEqual(expected);
  });
});

describe("split and join", () => {
  it("with use of registers", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["alloca", int()],
        ["alloca", int()],
        ["alloca", int()],
        ["alloca", int()],
        ["alloca", int()],
      ],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["assign", 1, "copy", 0],
          ["branch", 1, [3]],
        ]],
        ["block", [
          ["assign", 2, "move", 0],
          ["branch", 2, [3]],
        ]],
        ["block", [
          ["assign", 3, "phi", [1, 2]],
          ["assign", 4, "move", 3],
          ["return", 4],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
      [],
      [["token", 0]],
      [["token", 1], ["token", 2]],
      [["token", 3]],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(5);
    // expect(actual).toEqual(expected);
  });
});

describe("multiple returns", () => {
  it("of a register", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["alloca", int()],
      ],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["return", 0],
        ]],
        ["block", [
          ["return", 0],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("of a linear register", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [["alloca", unique(must_drop(int()))]],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["return", 0],
        ]],
        ["block", [
          ["return", 0],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("of several registers", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["alloca", int()],
        ["alloca", int()],
        ["alloca", int()],
      ],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["assign", 1, "copy", 0],
          ["return", 1],
        ]],
        ["block", [
          ["assign", 2, "move", 0],
          ["return", 2],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
      [],
      [["token", 0]],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });
});

describe("loop", () => {
  it("with use of a register", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["alloca", int()],
        ["alloca", int()],
        ["alloca", int()],
      ],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1]],
        ]],
        ["block", [
          ["assign", 1, "phi", [0, 2]],
          ["assign", 2, "constant"],
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["drop", 0],
          ["return", 1],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
      [["token", 0], ["token", 2]],
      [["token", 2]],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });

  it("with define-use-drop of a register", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["alloca", int()],
        ["alloca", int()],
        ["alloca", int()],
      ],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1]],
        ]],
        ["block", [
          ["assign", 1, "constant"],
          ["assign", 2, "copy", 1],
          ["drop", 1],
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["return", 0],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
      [],
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });

  it("with define-use-drop of a linear register", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["alloca", int()],
        ["alloca", unique(must_drop(int()))],
        ["alloca", int()],
      ],
      [
        ["block", [
          ["assign", 0, "constant"],
          ["branch", 0, [1]],
        ]],
        ["block", [
          ["assign", 1, "constant"],
          ["assign", 0, "copy", 1],
          ["drop", 1],
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["assign", 2, "constant"],
          ["return", 2],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: DependencyGraph = [
      [],
      [],
      [],
    ];
    const actual: DependencyGraph = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });
});
