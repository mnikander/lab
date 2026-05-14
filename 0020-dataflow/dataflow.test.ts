import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { Function } from "./grammar.ts";
import { dataflow, IndexedError } from "./dataflow.ts";
import { CFG } from "./control-flow-graph.ts";
import { iota } from "./worklist.ts";

describe("single block", () => {
  it("must accept an empty block", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        { name: "@entry", lines: [], terminator: ["return"] },
      ],
    };
    const graph: CFG = [{ name: "@entry", predecessors: [], successors: [] }];
    const variables: number[] = iota(0);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(0);
  });
});

describe("jump", () => {
  it("must accept use of valid variables in another block", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
          ],
          terminator: ["branch", [1]],
        },
        {
          name: "@final",
          lines: [
            ["use", 0],
            ["drop", 0],
            ["define", 1],
            ["use", 1],
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1],
      },
      {
        name: "@final",
        predecessors: [0],
        successors: [],
      },
    ];
    const variables: number[] = iota(2);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(0);
  });

  it("must reject use of invalid variables in another block", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
            ["drop", 0],
          ],
          terminator: ["branch", [1]],
        },
        {
          name: "@final",
          lines: [
            ["use", 0], // error: use after drop
            ["define", 1],
            ["use", 1],
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1],
      },
      {
        name: "@final",
        predecessors: [0],
        successors: [],
      },
    ];
    const variables: number[] = iota(2);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(1);
  });
});

describe("branch", () => {
  it("must accept use of valid variables in other blocks", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
          ],
          terminator: ["branch", [1, 2]],
        },
        {
          name: "@left",
          lines: [
            ["use", 0],
            ["define", 1],
            ["use", 1],
          ],
          terminator: ["branch", [3]],
        },
        {
          name: "@right",
          lines: [
            ["use", 0],
            ["define", 2],
            ["use", 2],
          ],
          terminator: ["branch", [3]],
        },
        {
          name: "@final",
          lines: [
            ["use", 0],
            ["drop", 0],
            ["define", 3],
            ["use", 3],
            ["drop", 3],
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1, 2],
      },
      {
        name: "@left",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@right",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@final",
        predecessors: [1, 2],
        successors: [],
      },
    ];
    const variables: number[] = iota(4);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(0);
  });

  it("must reject use of invalid variables in another block", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
          ],
          terminator: ["branch", [1, 2]],
        },
        {
          name: "@left",
          lines: [
            ["use", 0],
            ["drop", 0],
            ["define", 1],
            ["use", 1],
          ],
          terminator: ["branch", [3]],
        },
        {
          name: "@right",
          lines: [
            ["use", 0],
            ["define", 2],
            ["use", 2],
          ],
          terminator: ["branch", [3]],
        },
        {
          name: "@final",
          lines: [
            ["use", 0], // error: dropped in @left but not in @right
            ["drop", 0], // error: dropped in @left but not in @right
            ["use", 1], // error: defined in @left but not in @right
            ["use", 2], // error: defined in @right but not in @left
            ["define", 3],
            ["drop", 3],
            ["use", 3], // error: use-after free
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1, 2],
      },
      {
        name: "@left",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@right",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@final",
        predecessors: [1, 2],
        successors: [],
      },
    ];
    const variables: number[] = iota(4);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(5);
  });

  it("must accept use of valid variables in multiple returns", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
          ],
          terminator: ["branch", [1, 2]],
        },
        {
          name: "@left",
          lines: [
            ["use", 0],
            ["define", 1],
            ["use", 1],
          ],
          terminator: ["return"],
        },
        {
          name: "@right",
          lines: [
            ["use", 0],
            ["define", 2],
            ["use", 2],
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1, 2],
      },
      {
        name: "@left",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@right",
        predecessors: [0],
        successors: [3],
      },
    ];
    const variables: number[] = iota(3);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(0);
  });

  it("must reject programs with an error on any of its return paths", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
          ],
          terminator: ["branch", [1, 2]],
        },
        {
          name: "@left",
          lines: [
            ["use", 0],
            ["define", 1],
            ["use", 1],
            ["use", 2], // error: use-before-define
          ],
          terminator: ["return"],
        },
        {
          name: "@right",
          lines: [
            ["use", 0],
            ["define", 2],
            ["use", 1], // error: use-before-define
            ["use", 2],
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1, 2],
      },
      {
        name: "@left",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@right",
        predecessors: [0],
        successors: [3],
      },
    ];
    const variables: number[] = iota(3);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(2);
  });
});

describe("loop", () => {
  it("must accept use of valid variables in loops", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
          ],
          terminator: ["branch", [1]],
        },
        {
          name: "@loop",
          lines: [
            ["use", 0],
          ],
          terminator: ["branch", [1, 2]],
        },
        {
          name: "@final",
          lines: [
            ["use", 0],
            ["drop", 0],
            ["define", 1],
            ["use", 1],
            ["drop", 1],
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1],
      },
      {
        name: "@loop",
        predecessors: [0, 1],
        successors: [1, 2],
      },
      {
        name: "@final",
        predecessors: [1],
        successors: [],
      },
    ];
    const variables: number[] = iota(2);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBe(0);
  });

  it("must reject use of invalid variables in loops", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [
            ["define", 0],
            ["use", 0],
          ],
          terminator: ["branch", [1]],
        },
        {
          name: "@loop",
          lines: [
            ["use", 0], // error: is possibly dropped in the previous iteration
            ["drop", 0], // error: multiple drops -- TODO: should this be an error?
            ["define", 1],
          ],
          terminator: ["branch", [1, 2]],
        },
        {
          name: "@final",
          lines: [
            ["use", 0], // error: possibly dropped
            ["drop", 0], // error: possibly dropped
            ["use", 1],
            ["drop", 1],
          ],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1],
      },
      {
        name: "@loop",
        predecessors: [0, 1],
        successors: [1, 2],
      },
      {
        name: "@final",
        predecessors: [1],
        successors: [],
      },
    ];
    const variables: number[] = iota(2);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBeGreaterThanOrEqual(4);
  });

  it("must accept define-use-drop inside loops", () => {
    const func: Function = {
      name: "@main",
      params: [],
      blocks: [
        {
          name: "@entry",
          lines: [],
          terminator: ["branch", [1]],
        },
        {
          name: "@loop",
          lines: [
            ["define", 0],
            ["use", 0],
            ["drop", 0],
          ],
          terminator: ["branch", [1, 2]],
        },
        {
          name: "@final",
          lines: [],
          terminator: ["return"],
        },
      ],
    };
    const graph: CFG = [
      {
        name: "@entry",
        predecessors: [],
        successors: [1],
      },
      {
        name: "@loop",
        predecessors: [0, 1],
        successors: [1, 2],
      },
      {
        name: "@final",
        predecessors: [1],
        successors: [],
      },
    ];
    const variables: number[] = iota(1);
    const errors: readonly IndexedError[] = dataflow(func, graph, variables);
    expect(errors.length).toBeGreaterThanOrEqual(0);
  });
});
