// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";
import { VariableState } from "./lattice.ts";
import { to_index } from "./grammar.ts";
import { is_ok, Result } from "./result.ts";
import { Op } from "./dsl_grammar.ts";

export function update(
  state: VariableState[],
  ops: Op[],
): Result<VariableState[]> {
  for (const op of ops) {
    const i: number = to_index(op[1]);
    const s: VariableState = state[i];
    assert(
      s !== undefined,
      `Variable #${i} does not have a valid input state.`,
    );
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
        // TODO: a 'drop' MUST trigger a 'use' on the entire points-to set of a variable
        // - the signature of apply drop must be modified to include the points-to set
        // - in the 'Available' case, the 'apply_use' calls must be made, for the points-to set
        break;
      default: {
        const _o: never = op;
        return ["error", "unknown operation on variable state"];
      }
    }

    if (is_ok(result)) {
      state[i] = result[1];
    } else {
      return ["error", op[1] + ": " + result[1]];
    }
  }
  return ["ok", state];
}

function apply_define(state: VariableState): Result<VariableState> {
  // Note that the SSA property ensures there is only one definition in the
  // source code, so multiple passes over define must be due to loops.
  // Thus, we just treat 'define' as a reset of the variable item.
  switch (state) {
    case "Ambiguous":
    case "Destroyed":
    case "Available":
    case "Undefined":
      return ["ok", "Available"];
    default:
      throw Error("Bug: invalid variable state in 'apply_define'");
  }
}

function apply_use(state: VariableState): Result<VariableState> {
  // Note that the SSA property ensures there is only one definition in the
  // source code, so multiple passes over define must be due to loops.
  // Thus, we just treat 'define' as a reset of the variable item.
  switch (state) {
    case "Ambiguous":
      return ["error", "unsafe use"];
    case "Destroyed":
      return ["error", "use-after-drop"];
    case "Available":
      return ["ok", "Available"];
    case "Undefined":
      return ["error", "use-before-define"];
    default:
      throw Error("Bug: invalid variable state in 'apply_define'");
  }
}

function apply_drop(state: VariableState): Result<VariableState> {
  switch (state) {
    case "Ambiguous":
      return ["error", "unsafe drop"];
    case "Destroyed":
      return ["error", "double-drop"];
    case "Available":
      return ["ok", "Destroyed"];
    case "Undefined":
      return ["error", "drop-before-define"];
    default:
      throw Error("Bug: invalid variable state in 'apply_drop'");
  }
}
