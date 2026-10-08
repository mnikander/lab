// Copyright (c) 2026 Marco Nikander

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

export type Result = ["ok", VariableState[]] | ["error", message: string, line: number];
