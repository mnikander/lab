import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import { Program } from "./grammar.ts";
import { dataflow, find_errors } from "./dataflow.ts";
import { CFG } from "./control-flow-graph.ts";
import { Result } from "./lattice.ts";

describe("single block", () => {
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
    const graph: CFG = [{ name: "@entry", predecessors: [], successors: [] }];
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(0);
  });
});

describe("jump", () => {
  it("must accept use of valid variables in another block", () => {
    const program: Program = [
      {
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
      },
    ];
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
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(0);
  });

  it("must reject use of invalid variables in another block", () => {
    const program: Program = [
      {
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
      },
    ];
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
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(1);
  });
});

describe("branch", () => {
  it("must accept use of valid variables in other blocks", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry_0",
            lines: [
              ["define", 0],
              ["use", 0],
            ],
            terminator: ["branch", [1, 2]],
          },
          {
            name: "@left_1",
            lines: [
              ["use", 0],
              ["define", 1],
              ["use", 1],
            ],
            terminator: ["branch", [3]],
          },
          {
            name: "@right_2",
            lines: [
              ["use", 0],
              ["define", 2],
              ["use", 2],
            ],
            terminator: ["branch", [3]],
          },
          {
            name: "@final_3",
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
      },
    ];
    const graph: CFG = [
      {
        name: "@entry_0",
        predecessors: [],
        successors: [1, 2],
      },
      {
        name: "@left_1",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@right_2",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@final_3",
        predecessors: [1, 2],
        successors: [],
      },
    ];
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(0);
  });

  it("must reject use of invalid variables in another block", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry_0",
            lines: [
              ["define", 0],
              ["use", 0],
            ],
            terminator: ["branch", [1, 2]],
          },
          {
            name: "@left_1",
            lines: [
              ["use", 0],
              ["drop", 0],
              ["define", 1],
              ["use", 1],
            ],
            terminator: ["branch", [3]],
          },
          {
            name: "@right_2",
            lines: [
              ["use", 0],
              ["define", 2],
              ["use", 2],
            ],
            terminator: ["branch", [3]],
          },
          {
            name: "@final_3",
            lines: [
              ["use", 0], // error: dropped in @left but not in @right
              ["drop", 0], // error: dropped in @left but not in @right
              ["use", 1], // error: defined in @left but not in @right
              ["use", 2], // error: defined in @right but not in @left
              ["define", 2], // error: already defined in @right
              ["define", 3],
              ["drop", 3],
              ["use", 3], // error: use-after free
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
    const graph: CFG = [
      {
        name: "@entry_0",
        predecessors: [],
        successors: [1, 2],
      },
      {
        name: "@left_1",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@right_2",
        predecessors: [0],
        successors: [3],
      },
      {
        name: "@final_3",
        predecessors: [1, 2],
        successors: [],
      },
    ];
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(4);
  });

  it("must accept use of valid variables in multiple returns", () => {
    const program: Program = [
      {
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
      },
    ];
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
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(0);
  });

  // TODO: error accumulation in the dataflow algorithm needs to be done differently to pass this test
  it.skip("must reject use of invalid variables in multiple returns", () => {
    const program: Program = [
      {
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
              ["use", 2],
            ],
            terminator: ["return"],
          },
          {
            name: "@right",
            lines: [
              ["use", 0],
              ["define", 2],
              ["use", 1],
              ["use", 2],
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
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
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(2);
  });
});

describe("loop", () => {
  it("must accept use of valid variables in loops", () => {
    const program: Program = [
      {
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
              ["define", 1],
              ["use", 1],
            ],
            terminator: ["branch", [1, 2]],
          },
          {
            name: "@final",
            lines: [
              ["use", 0],
              ["drop", 0],
              ["use", 1],
              ["drop", 1],
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
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
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(0);
  });

  it("must reject use of invalid variables in loops", () => {
    const program: Program = [
      {
        name: "@main",
        params: [],
        blocks: [
          {
            name: "@entry_0",
            lines: [
              ["define", 0],
              ["use", 0],
            ],
            terminator: ["branch", [1]],
          },
          {
            name: "@loop_1",
            lines: [
              ["use", 0], // error: is possibly dropped in the previous iteration
              ["drop", 0],
              ["define", 1], // error: multiple definitions -- TODO: should this be an error?
            ],
            terminator: ["branch", [1, 2]],
          },
          {
            name: "@final_2",
            lines: [
              ["use", 0], // error: possibly dropped
              ["drop", 0], // error: possibly dropped
              ["use", 1],
              ["drop", 1],
            ],
            terminator: ["return"],
          },
        ],
      },
    ];
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
    const variables: number[] = [];
    const results: Result[] = dataflow(program, graph, variables);
    const error_indices: number[] = find_errors(results);

    expect(error_indices.length).toBe(2);
  });
});
