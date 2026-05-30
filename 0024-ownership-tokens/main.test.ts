import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import * as G from "./grammar.ts";
import { compute_dependencies, Deps } from "./main.ts";
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
  it("return a constant", () => {
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
    const expected: Deps = [["register", 0, []]];
    const actual: Deps = compute_dependencies(fun, cfg);
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
    const expected: Deps = [
      ["register", 0, []],
      ["register", 1, []],
      ["register", 2, []],
    ];
    const actual: Deps = compute_dependencies(fun, cfg);
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
    const expected: Deps = [["register", 0, []]];
    const actual: Deps = compute_dependencies(fun, cfg);
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
    const expected: Deps = [["register", 0, [["target_of", ["token_id", 0]]]]];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });
});

describe("jump", () => {
  it("use a defined variable in another block", () => {
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
    const expected: Deps = [["register", 0, []], ["register", 1, []]];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(2);
    // expect(actual).toEqual(expected);
  });
});

describe("split and join", () => {
  it("use defined variables in other blocks", () => {
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
          ["assign", 2, "copy", 0],
          ["branch", 2, [3]],
        ]],
        ["block", [
          ["assign", 3, "phi", [1, 2]],
          ["assign", 4, "move", 3],
          ["drop", 4],
          ["return", 0],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: Deps = [
      ["register", 0, []],
      ["register", 1, []],
      ["register", 2, []],
      ["register", 3, [["token_id", 1], ["token_id", 2]]],
      ["register", 4, [["token_id", 3]]],
    ];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(5);
    // expect(actual).toEqual(expected);
  });
});

describe("multiple returns", () => {
  it("use defined variables in multiple returns", () => {
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
          ["assign", 2, "copy", 0],
          ["return", 2],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: Deps = [
      ["register", 0, []],
      ["register", 1, []],
      ["register", 2, []],
    ];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });
});

describe("loop", () => {
  it("use defined variables in loops", () => {
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
          ["branch", 0, [1, 2]],
        ]],
        ["block", [
          ["drop", 0],
          ["assign", 1, "constant"],
          ["return", 1],
        ]],
      ],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: Deps = [
      ["register", 0, []],
      ["register", 1, []],
    ];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(2);
    expect(actual).toEqual(expected);
  });

  it("define-use-drop of a register inside loops", () => {
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
    const expected: Deps = [
      ["register", 0, []],
      ["register", 1, []],
      ["register", 2, []],
    ];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });
});

describe("linear variables", () => {
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
    const expected: Deps = [["register", 0, []]];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("multiple returns of a linear register", () => {
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
    const expected: Deps = [["register", 0, []]];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("define-use-drop of a linear register inside loops", () => {
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
    const expected: Deps = [
      ["register", 0, []],
      ["register", 1, []],
      ["register", 2, []],
    ];
    const actual: Deps = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });
});
