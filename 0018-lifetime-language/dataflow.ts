// Copyright (c) 2026 Marco Nikander

import {
  Block,
  Function,
  get_arg,
  get_tag,
  Line,
  Program,
  Register,
} from "./grammar.ts";
import { define, free, is_ok, Result, use } from "./lattice.ts";

export function dataflow(program: Program): undefined | [Register, Result] {
  const variables: Register[] = extract_variables_from_function(program[0]);
  let states: Map<Register, Result> = make_map(variables);
  // TODO: run dataflow analysis over the program
  states = dataflow_block(program[0].blocks[0], states);
  const maybe_error: undefined | [Register, Result] = find_errors(states);
  return maybe_error;
}

function find_errors(
  states: Map<Register, Result>,
): undefined | [Register, Result] {
  const maybe_error: undefined | [Register, Result] = states.entries().find((
    entry,
  ) => !is_ok(entry[1]));
  return maybe_error;
}

// in-place updates of 'states'
function dataflow_block(
  block: Block,
  states: Map<Register, Result>,
): Map<Register, Result> {
  block.lines.forEach((line) => dataflow_line(line, states));
  return states;
}

// in-place updates of 'states'
function dataflow_line(
  line: Line,
  states: Map<Register, Result>,
): void {
  const register: Register = get_arg(line);
  const result: undefined | Result = states.get(register);

  if (result) {
    switch (get_tag(line)) {
      case "define":
        states.set(register, define(result));
        break;
      case "use":
        states.set(register, use(result));
        break;
      case "free":
        states.set(register, free(result));
        break;
      default:
        states.set(register, [
          "error",
          "bottom",
          "instruction could not be processed",
        ]);
        break;
    }
  } else {
    states.set(register, [
      "error",
      "bottom",
      "register could not be found",
    ]);
  }
}

function make_map(registers: Register[]): Map<Register, Result> {
  const result: Map<Register, Result> = new Map();
  registers.forEach((reg) => result.set(reg, ["ok", "pre"]));
  return result;
}

function extract_variables_from_function(func: Function): Register[] {
  const params: Register[] = func.params;
  const blockwise: Register[][] = func.blocks.map(extract_variables_from_block);
  const variables: Register[] = blockwise.reduce((
    prev,
    next,
  ) => [...prev, ...next]);
  return [...params, ...variables];
}

function extract_variables_from_block(block: Block): Register[] {
  return block.lines.map((line) => get_arg(line));
}
