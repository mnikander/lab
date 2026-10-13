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
      "fail",
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
        return ["fail", "unknown operation on variable state"];
      }
    }

    if (is_ok(result)) {
      state[i] = result[1];
    } else {
      return ["fail", op[1] + ": " + result[1]];
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
      return ["fail", "unsafe use"];
    case "Destroyed":
      return ["fail", "use-after-drop"];
    case "Available":
      return ["ok", "Available"];
    case "Undefined":
      return ["fail", "use-before-define"];
    default:
      throw Error("Bug: invalid variable state in 'apply_define'");
  }
}

function apply_drop(state: VariableState): Result<VariableState> {
  switch (state) {
    case "Ambiguous":
      return ["fail", "unsafe drop"];
    case "Destroyed":
      return ["fail", "double-drop"];
    case "Available":
      return ["ok", "Destroyed"];
    case "Undefined":
      return ["fail", "drop-before-define"];
    default:
      throw Error("Bug: invalid variable state in 'apply_drop'");
  }
}
