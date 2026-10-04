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

const cfg_three: Graph = [
  {
    // @entry:
    pred: [],
    succ: [1],
  },
  {
    // @middle:
    pred: [0],
    succ: [2],
  },
  {
    // @final:
    pred: [1],
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
    // @merge:
    pred: [1, 2],
    succ: [4],
  },
  {
    // @final:
    pred: [3],
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
    // @after:
    pred: [1],
    succ: [3],
  },
  {
    // @final:
    pred: [2],
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

  it("three blocks", () => {
    const ops: BlockOperations[] = [[], [], []];
    const result: BlockState[] = fixed_point(cfg_three, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", []], ["Known", []]];
    expect(result).toEqual(expected);
  });

  it("split blocks", () => {
    const ops: BlockOperations[] = [[], [], []];
    const result: BlockState[] = fixed_point(cfg_split, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", []], ["Known", []]];
    expect(result).toEqual(expected);
  });

  it("diamond blocks", () => {
    const ops: BlockOperations[] = [[], [], [], [], []];
    const result: BlockState[] = fixed_point(cfg_diamond, ops);
    const expected: BlockState[] = [
      ["Bottom"],
      ["Known", []],
      ["Known", []],
      ["Known", []],
      ["Known", []],
    ];
    expect(result).toEqual(expected);
  });

  it("loop blocks", () => {
    const ops: BlockOperations[] = [[], [], [], []];
    const result: BlockState[] = fixed_point(cfg_loop, ops);
    const expected: BlockState[] = [["Bottom"], ["Known", []], ["Known", []], [
      "Known",
      [],
    ]];
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

  it("three blocks", () => {
    const ops: BlockOperations[] = [
      [ // first block
        [true, true],
        [true, false],
        [true, false],
        [false, true],
        [false, false],
        [false, false],
        [false, true],
        [false, false],
        [false, false],
      ],
      [ // second block
        [false, false],
        [false, true],
        [false, false],
        [true, false],
        [true, true],
        [true, false],
        [false, false],
        [false, true],
        [false, false],
      ],
      [ // third block does nothing, only serves to observe the results of the 2nd block
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
        [false, false],
      ],
    ];
    const result: BlockState[] = fixed_point(cfg_three, ops);
    const expected: BlockState[] = [
      ["Bottom"],
      [
        "Known",
        [
          "Destroyed",
          "Available",
          "Available",
          "Ambiguous",
          "Undefined",
          "Undefined",
          "Ambiguous",
          "Undefined",
          "Undefined",
        ],
      ],
      [
        "Known",
        [
          "Destroyed",
          "Destroyed",
          "Available",
          "Available", // Note: this one is technically 'Ambiguous', but since real programs are in SSA form, the analysis allows a 'define' to reset any state, to handle loops correctly
          "Destroyed",
          "Available",
          "Ambiguous",
          "Ambiguous",
          "Undefined",
        ],
      ],
    ];
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
      // variables which are defined in block 0:
      [true, true],
      [true, false],
      [true, false],
      [true, false],
      [true, false],
      // variables which are defined in block 1:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 2:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 3:
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
      // variables which are defined in block 0:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 1:
      [true, false],
      [true, true],
      [true, false],
      [true, false],
      [true, false],
      // variables which are defined in block 2:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 3:
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
      // variables which are defined in block 0:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      // variables which are defined in block 1:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      // variables which are defined in block 2:
      [true, false],
      [true, false],
      [true, true],
      [true, false],
      [true, false],
      // variables which are defined in block 3:
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
      // variables which are defined in block 0:
      [false, false],
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // variables which are defined in block 1:
      [false, false],
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // variables which are defined in block 2:
      [false, false],
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // variables which are defined in block 3:
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
    ], [
      // no transfers happen in block 4, it is only to check the results of block 3
      // variables which are defined in block 0:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 1:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 2:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 3:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // never defined:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      [false, false],
    ]];
    const result: BlockState[] = fixed_point(cfg_diamond, ops);
    const expected: BlockState[] = [["Bottom"], [
      "Known",
      [ // variable states at BEFORE entering block 1:
        // variables which are defined in block 0:
        "Destroyed",
        "Available",
        "Available",
        "Available",
        "Available",
        // variables which are defined in block 1:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // variables which are defined in block 2:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // variables which are defined in block 3:
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
        // variables which are defined in block 0:
        "Destroyed",
        "Available",
        "Available",
        "Available",
        "Available",
        // variables which are defined in block 1:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // variables which are defined in block 2:
        "Ambiguous",
        "Undefined",
        "Undefined",
        "Undefined",
        "Undefined",
        // variables which are defined in block 3:
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
        // variables which are defined in block 0:
        "Destroyed",
        "Ambiguous",
        "Ambiguous",
        "Available",
        "Available",
        // variables which are defined in block 1:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        // variables which are defined in block 2:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        // variables which are defined in block 3:
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
    ], [
      "Known",
      [ // variable states at BEFORE entering block 4, i.e. after completing block 3:
        // variables which are defined in block 0:
        "Destroyed",
        "Ambiguous",
        "Ambiguous",
        "Destroyed",
        "Available",
        // variables which are defined in block 1:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        // variables which are defined in block 2:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        // variables which are defined in block 3:
        "Available",
        "Available",
        "Available",
        "Destroyed",
        "Available",
        // never defined:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Undefined",
      ],
    ]];
    expect(result).toEqual(expected);
  });

  it("loop blocks", () => {
    const ops: BlockOperations[] = [[
      // block 0
      // variables which are defined in block 0:
      [true, true],
      [true, false],
      [true, false],
      [true, false],
      // variables which are defined in block 1:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 2:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 3:
      [false, true],
      [false, false],
      [false, false],
      [false, false],
    ], [
      // block 1
      // variables which are defined in block 0:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      // variables which are defined in block 1:
      [true, false],
      [true, true],
      [true, false],
      [true, false],
      // variables which are defined in block 2:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
      // variables which are defined in block 3:
      [false, false],
      [false, true],
      [false, false],
      [false, false],
    ], [
      // block 2
      // variables which are defined in block 0:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // variables which are defined in block 1:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
      // variables which are defined in block 2:
      [true, false],
      [true, false],
      [true, true],
      [true, false],
      // variables which are defined in block 3:
      [false, false],
      [false, false],
      [false, true],
      [false, false],
    ], [
      // block 3, do nothing, it is only to check the final results
      // variables which are defined in block 0:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 1:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 2:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
      // variables which are defined in block 3:
      [false, false],
      [false, false],
      [false, false],
      [false, false],
    ]];
    const result: BlockState[] = fixed_point(cfg_loop, ops);
    const expected: BlockState[] = [
      // block 0, in-set:
      ["Bottom"],
      // block 1, in-set -- this is the loop block, so it is a join of the block-0 and the block-1 out-sets:
      ["Known", [
        // variables which are defined in block 0:
        "Destroyed",
        "Ambiguous",
        "Available",
        "Available",
        // variables which are defined in block 1:
        "Ambiguous", // join of the out-states of block 0 and 1 results in 'Ambiguous' at the start of block 1
        "Ambiguous", // join of the out-states of block 0 and 1 results in 'Ambiguous' at the start of block 1
        "Ambiguous", // join of the out-states of block 0 and 1 results in 'Ambiguous' at the start of block 1
        "Ambiguous", // join of the out-states of block 0 and 1 results in 'Ambiguous' at the start of block 1
        // variables which are defined in block 2:
        "Ambiguous",
        "Ambiguous",
        "Undefined",
        "Undefined",
        // variables which are defined in block 3:
        "Ambiguous",
        "Ambiguous",
        "Undefined",
        "Undefined",
      ]],
      // block 2, in-set:
      ["Known", [
        // variables which are defined in block 0:
        "Destroyed",
        "Ambiguous",
        "Available",
        "Available",
        // variables which are defined in block 1:
        "Available", // this state actually recovers from 'Ambiguous', when leaving the loop
        "Destroyed", // this state actually recovers from 'Ambiguous', when leaving the loop
        "Available", // this state actually recovers from 'Ambiguous', when leaving the loop
        "Available", // this state actually recovers from 'Ambiguous', when leaving the loop
        // variables which are defined in block 2:
        "Ambiguous",
        "Ambiguous",
        "Undefined",
        "Undefined",
        // variables which are defined in block 3:
        "Ambiguous",
        "Ambiguous",
        "Undefined",
        "Undefined",
      ]],
      // block 3, in-set:
      ["Known", [
        // variables which are defined in block 0:
        "Destroyed",
        "Ambiguous",
        "Destroyed",
        "Available",
        // variables which are defined in block 1:
        "Available",
        "Destroyed",
        "Destroyed",
        "Available",
        // variables which are defined in block 2:
        "Available",
        "Available",
        "Destroyed",
        "Available",
        // variables which are defined in block 3:
        "Ambiguous",
        "Ambiguous",
        "Ambiguous",
        "Undefined",
      ]],
    ];
    expect(result).toEqual(expected);
  });
});
