// Copyright (c) 2026 Marco Nikander

import { Block, Function, get_arg, Program, Register } from "./grammar.ts";
import { is_ok, Result } from "./lattice.ts";

export function dataflow(program: Program): undefined | [Register, Result] {
  const variables: Register[] = extract_variables(program);
  const states: Map<Register, Result> = make_map(variables);
  // TODO: run dataflow analysis over the program
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

function make_map(registers: Register[]): Map<Register, Result> {
  const result: Map<Register, Result> = new Map();
  registers.forEach((reg) => result.set(reg, ["ok", "pre"]));
  return result;
}

function extract_variables(program: Program): Register[] {
  const blockwise: Register[][] = program.map(extract_variables_from_function);
  const variables: Register[] = blockwise.reduce((
    prev,
    next,
  ) => [...prev, ...next]);
  return variables;
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
