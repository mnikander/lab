// Copyright (c) 2026 Marco Nikander

import { BlockState, VariableState } from "./lattices.ts";

export type VariableOps = [defined: boolean, dropped: boolean];

export function block_transition(
  block_state: BlockState,
  transitions: VariableOps[],
): BlockState {
  let updated: VariableState[] = [];

  if (block_state[0] === "Bottom") {
    const count: number = transitions.length;
    updated = Array<VariableState>(count);
    updated.fill("Undefined");
  } else {
    updated = structuredClone(block_state[1]);
  }

  updated = updated.map((vs, i) =>
    variable_transition(vs, transitions[i][0], transitions[i][1])
  );
  
  return ["Known", updated];
}

function variable_transition(
  vs: VariableState,
  defined: boolean,
  destroyed: boolean,
): VariableState {
  // in-place update of `vs` is OK, since the whole VariableState-array is cloned in `block_transition()`
  if (defined) {
    vs = apply_define(vs);
  }
  if (destroyed) {
    vs = apply_destroy(vs);
  }
  return vs;
}

function apply_define(vs: VariableState): VariableState {
  // Note that the SSA property ensures there is only one definition in the
  // source code, so multiple passes over define must be due to loops.
  // Thus, we just treat 'define' as a reset of the variable item.
  switch (vs) {
    case "Ambiguous":
    case "Destroyed":
    case "Available":
    case "Undefined":
      return "Available";
    default:
      throw Error("Bug: invalid transition in 'apply_define'");
  }
}

function apply_destroy(vs: VariableState): VariableState {
  switch (vs) {
    case "Ambiguous":
      return "Ambiguous"; // error: potentially invalid drop
    case "Destroyed":
      return "Ambiguous"; // error: double-drop
    case "Available":
      return "Destroyed";
    case "Undefined":
      return "Ambiguous"; // error: drop-before-define
    default:
      throw Error("Bug: invalid transition in 'apply_destroy'");
  }
}
