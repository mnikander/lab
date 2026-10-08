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
