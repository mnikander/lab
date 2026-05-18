import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as G from "./grammar.ts";
import { all_good, check_function } from "./main.ts";
import { State } from "./lattice.ts";

describe("naive programs", () => {
  it.skip("must accept the empty program", () => {
    const program: G.Program = [];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must accept a function which returns a defined register", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [["alloca", ["local", "affine", "basic"]]],
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject a main function which returns a dropped register", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [["alloca", ["local", "affine", "basic"]]],
        [
          ["block", [
            ["define", 0],
            ["drop", 0],
            ["return", 0], // error: return-after-drop
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});

describe("functions with parameters", () => {
  it("must accept a main function which takes and returns a parameter", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [["param", ["local", "affine", "basic"]]],
        [],
        [
          ["block", [
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must accept a main function which takes two parameters and returns one", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "linear", "basic"]],
        [
          ["param", ["local", "affine", "basic"]],
          ["param", ["local", "linear", "basic"]],
        ],
        [],
        [
          ["block", [
            ["use", 0],
            ["drop", 0],
            ["return", 1],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject a main function which takes a parameter, drops it, and tries to return it", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [["param", ["local", "affine", "basic"]]],
        [],
        [
          ["block", [
            ["drop", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});

describe("jump", () => {
  it("must accept use of a defined variable in another block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject use of a dropped variable in another block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});

describe("split and join", () => {
  it("must accept use of defined variables in other blocks", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });
  it("must reject use of undefined/dropped variables in another block", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});

describe("multiple returns", () => {
  it("must accept use of defined variables in multiple returns", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject programs with an error on any of its return paths", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});

describe("loop", () => {
  it("must accept use of defined variables in loops", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
            ["return", 1],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must accept define-use-drop of a register inside loops", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject use of undefined/dropped variables in loops", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });

  it("must reject use of multiple drops of a register in a loop", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["local", "affine", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1]],
          ]],
          ["block", [
            ["drop", 0], // error: possible double-drop
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["define", 1],
            ["return", 1],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});

describe("linear variables", () => {
  it("must accept a function which returns a defined linear register", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["global", "linear", "basic"]],
        [],
        [["alloca", ["global", "linear", "basic"]]],
        [
          ["block", [
            ["define", 0],
            ["return", 0],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject a main function which returns a dropped linear register", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["global", "linear", "basic"]],
        [],
        [["alloca", ["global", "linear", "basic"]]],
        [
          ["block", [
            ["define", 0],
            ["drop", 0],
            ["return", 0], // error: return-after-drop
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });

  it("must reject a function which does not drop/return all linear registers", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["global", "linear", "basic"]],
        [],
        [
          ["alloca", ["global", "linear", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["define", 1],
            ["return", 1],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });

  it("must accept use of defined linear variables in multiple returns", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["global", "linear", "basic"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["return", 0],
          ]],
          ["block", [
            ["return", 0], // error: did not drop/return a linear register
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject a function which does not drop/return linear registers on all paths", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["global", "linear", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["define", 1],
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["drop", 0],
            ["return", 1],
          ]],
          ["block", [
            ["return", 1], // error: did not drop/return a linear register
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });

  it("must accept define-use-drop of a linear register inside loops", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["global", "linear", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
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
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(true);
  });

  it("must reject use of multiple drops of a linear register in a loop", () => {
    const program: G.Program = [
      [
        "func",
        ["result", ["local", "affine", "basic"]],
        [],
        [
          ["alloca", ["global", "linear", "basic"]],
          ["alloca", ["local", "affine", "basic"]],
        ],
        [
          ["block", [
            ["define", 0],
            ["use", 0],
            ["branch", [1]],
          ]],
          ["block", [
            ["drop", 0], // error: possible double-drop
            ["branch", [1, 2]],
          ]],
          ["block", [
            ["define", 1],
            ["return", 1],
          ]],
        ],
      ],
    ];
    const states: State[] = check_function(program[0]);
    expect(all_good(states)).toBe(false);
  });
});
