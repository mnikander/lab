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
): State[] {
  const variable_count: number = variables.length;
  const block_count: number = graph.length;
  const out_sets: State[][] = fill(
    block_count,
    default_states(variable_count),
  );
  const worklist: Worklist = make_worklist(block_count);
  while (size(worklist) > 0) {
    const index: number = try_pop(worklist) as number;
    const node: Node = graph[index];
    const block: Block = func.blocks[index];
    const incoming: State[][] = node.predecessors.map((p) => out_sets[p]);
    const in_set: State[] = incoming
      .reduce(
        join_states,
        default_states(variable_count),
      );
    const out_set: State[] = dataflow_block(block, in_set);
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
  states: State[],
): State[] {
  block.lines.forEach((line) => dataflow_line(line, states));
  return states;
}

// in-place updates of 'states'
function dataflow_line(
  line: Line,
  states: State[],
): void {
  const register: number = get_arg(line);
  const result: undefined | State = states[register];

  if (result) {
    switch (get_tag(line)) {
      case "define":
        states[register] = define(result);
        break;
      case "use":
        states[register] = use(result);
        break;
      case "drop":
        states[register] = drop(result);
        break;
      default:
        states[register] = [
          "top",
          "instruction could not be processed",
        ];
        break;
    }
  } else {
    states[register] = [
      "top",
      "register could not be found",
    ];
  }
}
