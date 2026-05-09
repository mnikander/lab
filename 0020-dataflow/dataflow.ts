// Copyright (c) 2026 Marco Nikander

import { CFG } from "./control-flow-graph.ts";
import { Block, get_arg, get_tag, Line, Program } from "./grammar.ts";
import { define, drop, State, use } from "./lattice.ts";
import {
  copy,
  fill,
  make_worklist,
  size,
  try_pop,
  Worklist,
} from "./worklist.ts";

export function dataflow(
  program: Program,
  graph: CFG,
  variables: number[],
): State[] {
  const variable_count: number = variables.length;
  const block_count: number = graph.length;
  const default_state: State[] = fill(variable_count, ["ok", "bottom"]);
  let out_states: State[][] = fill(block_count, default_state);
  let worklist: Worklist = make_worklist(block_count);
  while (size(worklist) > 0) {
    const block: number = try_pop(worklist) as number;
    // let states: State[] = element-wise join of all predecessor out_states
    // states = dataflow_block(program[block], states)
    // if (states !== out_set[block]) { // I need element-wise inequality here
    //     graph[block].successors.forEach(s => (s, worklist));
    //     out_states[block] = states;
    // }
  }

  // we assume there is a final block which contains all errors
  // TODO: accumulate errors from all blocks, and return them from this function
  return out_states.pop() as State[];
}

export function find_errors(
  states: State[],
): number[] {
  const zipped: [number, State][] = states.map((s, i) => [i, s]);
  const filtered: [number, State][] = zipped.filter((e) => e[1][0] === "error");
  const result: number[] = filtered.map((e) => e[0]);
  return result;
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
          "error",
          "bottom",
          "instruction could not be processed",
        ];
        break;
    }
  } else {
    states[register] = [
      "error",
      "bottom",
      "register could not be found",
    ];
  }
}
