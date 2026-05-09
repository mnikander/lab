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
    const incoming: readonly (readonly State[])[] = node.predecessors.map((p) =>
      out_sets[p]
    );

    let out_set: readonly State[] = [];
    if (node.predecessors.length === 0) {
      out_set = dataflow_block(
        block,
        default_states(variable_count),
      );
    } else {
      const in_set: readonly State[] = incoming
        .reduce(
          join_states,
        );
      out_set = dataflow_block(block, in_set);
    }
    if (!equal_states(out_set, out_sets[index])) {
      node.successors.forEach((s) => try_push(s, worklist));
      out_sets[index] = out_set;
    }
  }

  // we assume there is a final block which contains all errors
  // TODO: accumulate errors from all blocks, and return them from this function
  return out_sets.pop() as State[];
}

// in-place updates of 'states'
function dataflow_block(
  block: Block,
  states: readonly State[],
): readonly State[] {
  block.lines.forEach((line) => dataflow_line(line, states));
  return states;
}

// in-place updates of 'states'
function dataflow_line(
  line: Line,
  states: readonly State[],
): State[] {
  const register: number = get_arg(line);
  const state: undefined | State = states[register];

  const updated: State[] = states.map((e) => e);

  if (state !== undefined) {
    switch (get_tag(line)) {
      case "define":
        updated[register] = define(state);
        break;
      case "use":
        updated[register] = use(state);
        break;
      case "drop":
        updated[register] = drop(state);
        break;
      default:
        updated[register] = [
          "top",
          "instruction could not be processed",
        ];
        break;
    }
  } else {
    updated[register] = [
      "top",
      "register could not be found",
    ];
  }
  return updated;
}
