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

  it("diamond blocks", () => {
    // a variable can be defined in blocks 0, 1, 2, 3, or never -- that's 5 possibilities
    // a variable can be dropped in blocks 0, 1, 2, 3, or never -- that's 5 possibilities
    // that means a total of 5x5=25 variables are needed to exhaustively test the options
    const ops: BlockOperations[] = [[
      // transfers which happen in block 0:
      // defined in block 0:
      [true, true],
      [true, false],
      [true, false],
      [true, false],
      [true, false],
      // defined in block 1:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // defined in block 2:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // defined in block 3:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // never defined:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
    ], [
      // transfers which happen in block 1:
      // defined in block 0:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      // defined in block 1:
      [true, false],
      [true, true],
      [true, false],
      [true, false],
      [true, false],
      // defined in block 2:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      // defined in block 3:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      // never defined:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      [false, false],
    ], [
      // transfers which happen in block 2:
      // defined in block 0:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      // defined in block 1:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      // defined in block 2:
      [true, false],
      [true, false],
      [true, true],
      [true, false],
      [true, false],
      // defined in block 3:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      // never defined:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      [false, false],
    ], [
      // transfers which happen in block 3:
      // defined in block 0:
      [false, false],
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // defined in block 1:
      [false, false],
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // defined in block 2:
      [false, false],
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // defined in block 3:
      [true, false],
      [true, false],
      [true, false],
      [true, true],
      [true, false],
      // never defined:
      [false, false],
      [false, false],
      [false, false],
      [false, true],
      [false, false],
    ]];
    const result: BlockState[] = fixed_point(cfg_diamond, ops);
    const expected: BlockState[] = [["Bottom"], [
      "Known",
      [ // variable states at BEFORE entering block 1:
        // defined in block 0:
        "Destroyed",
        "Available",
        "Available",
        "Available",
        "Available",
        // defined in block 1:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // defined in block 2:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // defined in block 3:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // never defined:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
      ],
    ], [
      "Known",
      [ // variable states at BEFORE entering block 2:
        // defined in block 0:
        "Destroyed",
        "Available",
        "Available",
        "Available",
        "Available",
        // defined in block 1:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // defined in block 2:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // defined in block 3:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // never defined:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
      ],
    ], [
      "Known",
      [ // variable states at BEFORE entering block 3:
        // defined in block 0:
        "Destroyed",
        "Ambiguous",
        "Ambiguous",
        "Available",
        "Available",
        // defined in block 1:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        // defined in block 2:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        // defined in block 3:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Undefined",
        "Undefined",
        // never defined:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Undefined",
        "Undefined",
      ],
    ]];
    expect(result).toEqual(expected);
  });

  it.skip("loop blocks", () => {
    const ops: BlockOperations[] = [[], [], []];
    const result: BlockState[] = fixed_point(cfg_loop, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", []], ["Known", []]];
    expect(result).toEqual(expected);
  });
});
