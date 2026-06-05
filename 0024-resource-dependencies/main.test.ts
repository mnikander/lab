import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import * as G from "./grammar.ts";
import { compute_dependencies, Dependencies } from "./main.ts";
import { Graph } from "./graph.ts";
import { make_cfg } from "./control-flow-graph.ts";

function int(): G.Type {
  return ["type", "inner", "cloneable", "no_drop", ["int"]];
}

function borrow(attributes: G.Type): G.Type {
  return ["type", "inner", "cloneable", "no_drop", [
    "borrowed",
    attributes,
  ]];
}

function own(attributes: G.Type): G.Type {
  return ["type", "inner", "cloneable", "no_drop", ["owned", attributes]];
}

function outer(attributes: G.Type): G.Type {
  attributes[1] = "outer";
  return attributes;
}

function unique(attributes: G.Type): G.Type {
  attributes[2] = "unique";
  return attributes;
}

function must_drop(attributes: G.Type): G.Type {
  attributes[3] = "must_drop";
  return attributes;
}

describe("functions with a single block", () => {
  it("return a resource", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [["local", int()]],
      [["block", [
        ["assign", 0, "constant"],
        ["return", 0],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: Dependencies = [
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("return a linear resource", () => {
    const fun: G.Function = [
      "func",
      ["result", unique(must_drop(int()))],
      [],
      [["local", unique(must_drop(int()))]],
      [["block", [
        ["assign", 0, "constant"],
        ["return", 0],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: Dependencies = [
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
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
        ["local", int()],
      ],
      [["block", [
        ["assign", 2, "add", 0, 1],
        ["return", 2],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: Dependencies = [
      [],
      [],
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
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
    const expected: Dependencies = [
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("identity function on borrows", () => {
    const fun: G.Function = [
      "func",
      ["result", borrow(int())],
      [["param", outer(borrow(outer(int())))]], // allowed to escape
      [],
      [["block", [
        ["return", 0],
      ]]],
    ];
    const cfg: Graph = make_cfg(fun);
    const expected: Dependencies = [
      [["deref", ["slot", 0]]],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });
});

describe("jump", () => {
  it("with use of a resource", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["local", int()],
        ["local", int()],
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
    const expected: Dependencies = [
      [],
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(2);
    // expect(actual).toEqual(expected);
  });
});

describe("split and join", () => {
  it("with use of resources", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["local", int()],
        ["local", int()],
        ["local", int()],
        ["local", int()],
        ["local", int()],
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
    const expected: Dependencies = [
      [],
      [],
      [["slot", 0]],
      [["slot", 1], ["slot", 2]],
      [["slot", 3]],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(5);
    // expect(actual).toEqual(expected);
  });
});

describe("multiple returns", () => {
  it("of a resource", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["local", int()],
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
    const expected: Dependencies = [
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("of a linear resource", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [["local", unique(must_drop(int()))]],
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
    const expected: Dependencies = [
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(1);
    // expect(actual).toEqual(expected);
  });

  it("of several resources", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["local", int()],
        ["local", int()],
        ["local", int()],
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
    const expected: Dependencies = [
      [],
      [],
      [["slot", 0]],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });
});

describe("loop", () => {
  it("with use of a resource", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["local", int()],
        ["local", int()],
        ["local", int()],
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
    const expected: Dependencies = [
      [],
      [["slot", 0], ["slot", 2]],
      [["slot", 2]],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });

  it("with define-use-drop of a resource", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["local", int()],
        ["local", int()],
        ["local", int()],
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
    const expected: Dependencies = [
      [],
      [],
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });

  it("with define-use-drop of a linear resource", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [
        ["local", int()],
        ["local", unique(must_drop(int()))],
        ["local", int()],
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
    const expected: Dependencies = [
      [],
      [],
      [],
    ];
    const actual: Dependencies = compute_dependencies(fun, cfg);
    expect(actual.length).toBe(3);
    // expect(actual).toEqual(expected);
  });
});
