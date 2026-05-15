// Copyright (c) 2026 Marco Nikander

import { assert } from "node:console";
import * as G from "./grammar.ts";

export type CFG = Node[];

export type Node = {
  pred: number[];
  succ: number[];
};

export function make_cfg(func: undefined | G.Function): CFG {
  if (func === undefined) {
    return [];
  } else {
    const blocks: G.Block[] = G.get_blocks(func);
    const successors: number[][] = blocks.map(
      extract_successors,
    );

    const predecessors: number[][] = blocks.map((_b) => []); // initialize empty array
    for (let start = 0; start < blocks.length; ++start) {
      const ends: number[] = successors[start];
      ends.forEach((e) => predecessors[e].push(start));
    }

    // zip
    const result: CFG = blocks.map((_b, i) => {
      return {
        pred: predecessors[i],
        succ: successors[i],
      };
    });
    return result;
  }
}

function extract_successors(block: G.Block): G.Register[] {
  const lines: G.Line[] = G.get_lines(block);
  const last_index: number = lines.length - 1;
  assert(last_index > 0, "block must have at least one instruction");
  const line: G.Line = lines[last_index];
  if (line[0] === "return") {
    return [];
  } else if (line[0] === "branch") {
    return line[1];
  } else {
    throw Error("Unexpected error while extracting successor blocks");
  }
}
