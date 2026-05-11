// Copyright (c) 2026 Marco Nikander

import { CFG, Node } from "./control-flow-graph.ts";
import { Block, Function, get_arg, get_tag, Line } from "./grammar.ts";
import {
  default_states,
  define,
  drop,
  equal_states,
  join_states,
  State,
  use,
} from "./lattice.ts";
import {
  fill,
  make_worklist,
  size,
  try_pop,
  try_push,
  Worklist,
} from "./worklist.ts";

export function dataflow(
  func: Function,
  graph: CFG,
  variables: number[],
): readonly State[] {
  const variable_count: number = variables.length;
  const block_count: number = graph.length;
  const out_sets: (readonly State[])[] = fill(
    block_count,
    default_states(variable_count),
  );
  const worklist: Worklist = make_worklist(block_count);
  while (size(worklist) > 0) {
    const index: number = try_pop(worklist) as number;
    const node: Node = graph[index];
    const block: Block = func.blocks[index];

    const in_set: readonly State[] = compute_in_set(
      variable_count,
      node,
      out_sets,
    );
    const out_set: readonly State[] = dataflow_block(block, in_set);

    if (!equal_states(out_set, out_sets[index])) {
      node.successors.forEach((s) => try_push(s, worklist));
      out_sets[index] = out_set;
    }
  }

  // we assume there is a final block which contains all errors
  // TODO: accumulate errors from all blocks, and return them from this function
  return out_sets.pop() as State[];
}

// TODO: this function is buggy
function compute_in_set(
  variable_count: number,
  node: Node,
  out_sets: readonly (readonly State[])[],
): readonly State[] {
  if (node.predecessors.length === 0) {
    return default_states(variable_count);
  } else {
    let in_set: State[] = out_sets[node.predecessors[0]].map((e) => e);
    for (let i = 1; i < node.predecessors.length; ++i) {
      const p: number = node.predecessors[i];
      in_set = join_states(in_set, out_sets[p]);
    }
    return in_set;
  }
}

function dataflow_block(
  block: Block,
  states: readonly State[],
): readonly State[] {
  const updated: State[] = states.map((e) => e);
  block.lines.forEach((line) => dataflow_line(line, updated));
  return updated;
}

// in-place updates of 'states'
function dataflow_line(
  line: Line,
  mutable: State[],
): State[] {
  const register: number = get_arg(line);
  if (mutable[register] !== undefined) {
    switch (get_tag(line)) {
      case "define":
        mutable[register] = define(mutable[register]);
        break;
      case "use":
        mutable[register] = use(mutable[register]);
        break;
      case "drop":
        mutable[register] = drop(mutable[register]);
        break;
      default:
        mutable[register] = [
          "error",
          "instruction could not be processed",
        ];
        break;
    }
  } else {
    mutable[register] = [
      "error",
      "register could not be found",
    ];
  }
  return mutable;
}
