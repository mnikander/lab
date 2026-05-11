// Copyright (c) 2026 Marco Nikander

import { CFG, Node } from "./control-flow-graph.ts";
import { Block, Function, get_arg, get_tag, Line } from "./grammar.ts";
import {
  default_states,
  define,
  drop,
  equal_states,
  Error,
  is_state,
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

export type IndexedError = [number, string];

export function dataflow(
  func: Function,
  graph: CFG,
  variables: number[],
): readonly IndexedError[] {
  const variable_count: number = variables.length;
  const block_count: number = graph.length;
  const out_sets: (readonly State[])[] = fill(
    block_count,
    default_states(variable_count),
  );
  const worklist: Worklist = make_worklist(block_count);
  const error_log: IndexedError[] = [];
  while (size(worklist) > 0) {
    const index: number = try_pop(worklist) as number;
    const node: Node = graph[index];
    const block: Block = func.blocks[index];

    const in_set: readonly State[] = compute_in_set(
      variable_count,
      node,
      out_sets,
    );
    const out_set: readonly State[] = dataflow_block(block, in_set, error_log);

    if (!equal_states(out_set, out_sets[index])) {
      node.successors.forEach((s) => try_push(s, worklist));
      out_sets[index] = out_set;
    }
  }
  return error_log;
}

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
  error_log: IndexedError[],
): readonly State[] {
  const updated: State[] = states.map((e) => e);
  block.lines.forEach((line) => dataflow_line(line, updated, error_log));

  // this is super important: after processing a block, any remaining "bottom" entries must be changed to "undefined"
  const no_bottom: readonly State[] = updated.map((s) => {
    return s[0] === "bottom" ? ["undefined"] : s;
  });
  return no_bottom;
}

// in-place updates of 'states'
function dataflow_line(
  line: Line,
  mutable: State[],
  error_log: IndexedError[],
): State[] {
  const register: number = get_arg(line);
  if (mutable[register] !== undefined) {
    let result: Error | State = ["bottom"];
    switch (get_tag(line)) {
      case "define":
        result = define(mutable[register]);
        break;
      case "use":
        result = use(mutable[register]);
        break;
      case "drop":
        result = drop(mutable[register]);
        break;
      default:
        result = [
          "error",
          "instruction could not be processed",
        ];
        break;
    }
    if (is_state(result)) {
      mutable[register] = result;
    } else {
      mutable[register] = ["top"];
      error_log.push([register, result[1]]);
    }
  } else {
    error_log.push(
      [register, "register could not be found"],
    );
  }
  return mutable;
}
