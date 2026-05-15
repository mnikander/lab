// Copyright (c) 2026 Marco Nikander

import { assert } from "node:console";
import * as G from "./grammar.ts";
import { Graph, Node } from "./graph.ts";

export function make_cfg(func: undefined | G.Function): Graph {
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
    const result: Graph = blocks.map((_b, i) => {
      const node: Node = {
        pred: predecessors[i],
        succ: successors[i],
      };
      return node;
    });
    return result;
  }
}

function extract_successors(block: G.Block): G.Register[] {
  const lines: G.Line[] = G.get_lines(block);
  if (lines.length <= 0) {
    return [];
  } else {
    const last_index: number = lines.length - 1;
    const line: G.Line = lines[last_index];
    if (line[0] === "return") {
      return [];
    } else if (line[0] === "branch") {
      return line[1];
    } else {
      throw Error("Unexpected error while extracting successor blocks");
    }
  }
}
