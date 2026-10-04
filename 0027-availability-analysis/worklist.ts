// Copyright (c) 2026 Marco Nikander

import { Graph } from "./graph.ts";
import { BlockState, is_equal, join_block } from "./lattices.ts";
import { block_transfer, BlockOperations } from "./transfer.ts";

export function fixed_point(cfg: Graph, ops: BlockOperations[]): BlockState[] {
  if (cfg.length !== ops.length) {
    throw Error(
      `Control flow graph and block operations must have the same number of entries (${cfg.length} vs. ${ops.length}).`,
    );
  }

  const variable_count: number = ops[0].length;
  if (ops.find((o) => o.length !== variable_count) !== undefined) {
    throw Error(
      `Not all blocks contain ${variable_count} booleans to describe the operations on variables`,
    );
  }

  const states: BlockState[] = new Array(cfg.length);
  states.fill(["Bottom"]);
  const worklist: Array<number> = Array.from({ length: cfg.length }, (_, i) => i);
  const workset: Set<number> = new Set(worklist); // helps avoid enqueing stuff which is already in the worklist

  for (const current of worklist) {
    workset.delete(current);
    const out_state_of_current: BlockState = block_transfer(
      states[current],
      ops[current],
    );
    for (const successor of cfg[current].succ) {
      const in_state_of_successor: BlockState = join_block(
        states[successor],
        out_state_of_current,
      );
      if (!is_equal(states[successor], in_state_of_successor)) { // did the input-state of the successor-block change?
        states[successor] = in_state_of_successor;
        enqueue(successor, worklist, workset);
      }
    }
  }
  return states;
}

// iff the worklist/workset do NOT contain the 'element', then add the element to the worklist and workset
function enqueue(element: number, worklist: Array<number>, workset: Set<number>) {
  if (!workset.has(element)) {
    worklist.push(element);
    workset.add(element);
  }
}
