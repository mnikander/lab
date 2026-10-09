// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";
import {
  apply_define,
  apply_drop,
  apply_use,
  VariableState,
} from "./lattice.ts";
import { Block, Instructions, Line, ResourceId, to_index } from "./grammar.ts";
import { is_ok, Result } from "./result.ts";
import * as DSL from "./dsl_grammar.ts";

export function linewise_availability(
  code: Block,
  points_to_set: ResourceId[][],
  state: VariableState[],
): Result<VariableState[]> {
  assert(
    state.length === points_to_set.length,
    `The number of variable states and points-to sets must be equal. ${state.length} != ${points_to_set.length}`,
  );
  const instructions: Instructions = code[2];
  const lines: Line[] = [...instructions.slice(1)] as Line[];
  for (const l of lines) {
    const ops: DSL.Op[] = DSL.translate(l, points_to_set, state);
    const result: Result<VariableState[]> = update(
      state,
      ops,
    );
    if (is_ok(result)) {
      state = result[1];
    } else {
      return result;
    }
  }

  return ["ok", state];
}

function update(
  state: VariableState[],
  ops: DSL.Op[],
): Result<VariableState[]> {
  for (const op of ops) {
    const result: Result<VariableState[]> = update_one(state, op);
    if (is_ok(result)) {
      state = result[1];
    } else {
      return result;
    }
  }
  return ["ok", state];
}

function update_one(
  state: VariableState[],
  op: DSL.Op,
): Result<VariableState[]> {
  const i: number = to_index(op[1]);
  const s: VariableState = state[i];
  assert(s !== undefined, `Variable #${i} does not have a valid input state.`);
  let result: Result<VariableState> = [
    "error",
    "Bug: no DSL operation was applied",
  ];

  switch (op[0]) {
    case "define":
      result = apply_define(s);
      break;
    case "use":
      result = apply_use(s);
      break;
    case "drop":
      result = apply_drop(s);
      break;
    case "return":
      result = apply_use(s); // TODO remove this if return can be translated into DSL.Use
      break;
    default:
      return op as never;
  }

  if (is_ok<VariableState>(result)) {
    state[i] = result[1];
    return ["ok", state];
  } else {
    return result;
  }
}
