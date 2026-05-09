// Copyright (c) 2026 Marco Nikander

import { assert } from "node:console";
import { CFG, Node } from "./control-flow-graph.ts";
import { Block, Function, get_arg, get_tag, Line } from "./grammar.ts";
import { define, drop, join_state, State, use } from "./lattice.ts";
import {
  copy,
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
  const out_states: State[][] = fill(
    block_count,
    default_states(variable_count),
  );
  const worklist: Worklist = make_worklist(block_count);
  while (size(worklist) > 0) {
    const index: number = try_pop(worklist) as number;
    const node: Node = graph[index];
    const block: Block = func.blocks[index];
    const predecessor_states: State[][] = node.predecessors.map((p) =>
      out_states[p]
    );
    let states: State[] = predecessor_states
      .reduce(
        join_states,
        default_states(variable_count),
      );
    states = dataflow_block(block, states);
    if (!equal_states(states, out_states[index])) {
      node.successors.forEach((s) => try_push(s, worklist));
      out_states[index] = states;
    }
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

function equal_states(left: State[], right: State[]): boolean {
  const element_wise: boolean[] = left.map((_s, i) => {
    return (left[i][0] === right[i][0] && left[i][1] === right[i][1]);
  });
  const all_equal: boolean = element_wise.reduce((acc: boolean, c: boolean) => {
    return acc && c;
  }, true);
  return all_equal;
}

function join_states(left: State[], right: State[]): State[] {
  assert(left.length === right.length, "State arrays must be of equal length");
  const result: State[] = left.map((_s, i) => join_state(left[i], right[i]));
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

function default_states(variable_count: number): State[] {
  return fill(variable_count, ["ok", "bottom"]);
}
