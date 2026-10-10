// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";
import {
  apply_define,
  apply_drop,
  apply_use,
  VariableState,
} from "./lattice.ts";
import { to_index } from "./grammar.ts";
import { is_ok, Result } from "./result.ts";
import { Op } from "./dsl_grammar.ts";

export function update(
  state: VariableState[],
  ops: Op[],
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
  op: Op,
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
    default: {
      const _o: never = op;
      return ["error", "unknown operation on variable state"];
    }
  }

  if (is_ok<VariableState>(result)) {
    state[i] = result[1];
    return ["ok", state];
  } else {
    return ["error", op[1] + ": " + result[1]];
  }
}
