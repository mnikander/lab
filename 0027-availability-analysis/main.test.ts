import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Graph } from "./graph.ts";
import { BlockOperations } from "./transfer.ts";
import { BlockState } from "./lattices.ts";
import { fixed_point } from "./worklist.ts";

const cfg_one: Graph = [
  {
    // @entry:
    pred: [],
    succ: [],
  },
];

const cfg_two: Graph = [
  {
    // @entry:
    pred: [],
    succ: [1],
  },
  {
    // @final:
    pred: [0],
    succ: [],
  },
];

const cfg_split: Graph = [
  {
    // @entry:
    pred: [],
    succ: [1, 2],
  },
  {
    // @left:
    pred: [0],
    succ: [],
  },
  {
    // @right:
    pred: [0],
    succ: [],
  },
];

const cfg_diamond: Graph = [
  {
    // @entry:
    pred: [],
    succ: [1, 2],
  },
  {
    // @left:
    pred: [0],
    succ: [3],
  },
  {
    // @right:
    pred: [0],
    succ: [3],
  },
  {
    // @final:
    pred: [1, 2],
    succ: [],
  },
];

const cfg_loop: Graph = [
  {
    // @entry:
    pred: [],
    succ: [1],
  },
  {
    // @loop:
    pred: [0, 1],
    succ: [1, 2],
  },
  {
    // @final:
    pred: [1],
    succ: [],
  },
];

describe("fixed-point of empty blocks", () => {
  it("one block", () => {
    const ops: BlockOperations[] = [[]];
    const result: BlockState[] = fixed_point(cfg_one, ops);
    const expected: BlockState[] = [["Bottom"]];
    // Note that since the 'Entry' block is not allowed to have incoming edges
    // in static single-assigment (SSA) form, the input block state of the entry
    // block is _always_ "Bottom".
    // This prototype does not enforce this SSA property, however.
    expect(result).toEqual(expected);
  });

  it("two blocks", () => {
    const ops: BlockOperations[] = [[], []];
    const result: BlockState[] = fixed_point(cfg_two, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", []]];
    expect(result).toEqual(expected);
  });

  it("split blocks", () => {
    const ops: BlockOperations[] = [[], [], []];
    const result: BlockState[] = fixed_point(cfg_split, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", []], ["Known", []]];
    expect(result).toEqual(expected);
  });

  it("diamond blocks", () => {
    const ops: BlockOperations[] = [[], [], [], []];
    const result: BlockState[] = fixed_point(cfg_diamond, ops);
    const expected: BlockState[] = [
      ["Bottom"],
      ["Known", []],
      ["Known", []],
      ["Known", []],
    ];
    expect(result).toEqual(expected);
  });

  it("loop blocks", () => {
    const ops: BlockOperations[] = [[], [], []];
    const result: BlockState[] = fixed_point(cfg_loop, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", []], ["Known", []]];
    expect(result).toEqual(expected);
  });
});

describe("fixed-point of blocks with variables", () => {
  it("two blocks", () => {
    const ops: BlockOperations[] = [[
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ], [ // whatever happens in the 2nd block, should not effect the **input** state of the 2nd block
      [false, true], // should do nothing to the test result
      [false, true], // should do nothing to the test result
      [false, true], // should do nothing to the test result
      [false, true], // should do nothing to the test result
    ]];
    const result: BlockState[] = fixed_point(cfg_two, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", [
      "Undefined",
      "Ambiguous",
      "Available",
      "Destroyed",
    ]]];
    expect(result).toEqual(expected);
  });

  it("split blocks", () => {
    const ops: BlockOperations[] = [[
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ], [ // whatever happens in the 2nd block, should not effect the test result
      [false, true],
      [false, true],
      [false, true],
      [false, true],
    ], [ // whatever happens in the 3rd block, should not effect the test result
      [false, true],
      [false, true],
      [false, true],
      [false, true],
    ]];
    const result: BlockState[] = fixed_point(cfg_split, ops);
    const expected: BlockState[] = [
      ["Bottom"],
      [
        "Known",
        [
          "Undefined",
          "Ambiguous",
          "Available",
          "Destroyed",
        ],
      ],
      [
        "Known",
        [
          "Undefined",
          "Ambiguous",
          "Available",
          "Destroyed",
        ],
      ],
    ];
    expect(result).toEqual(expected);
  });
});
