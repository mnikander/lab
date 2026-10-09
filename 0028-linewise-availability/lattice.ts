// Copyright (c) 2026 Marco Nikander

import { Result } from "./result.ts";

// State of a variable:
//
//              Ambiguous
//             /         \
//       Available     Destroyed
//             \         /
//              Undefined
//
export type VariableState =
  | "Ambiguous"
  | "Destroyed"
  | "Available"
  | "Undefined";

export function apply_define(state: VariableState): Result<VariableState> {
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
      throw Error("Bug: invalid transfer in 'apply_define'");
  }
}

export function apply_use(state: VariableState): Result<VariableState> {
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
      throw Error("Bug: invalid transfer in 'apply_define'");
  }
}

export function apply_drop(state: VariableState): Result<VariableState> {
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
      throw Error("Bug: invalid transfer in 'apply_drop'");
  }
}
