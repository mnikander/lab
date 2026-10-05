// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";

// State of the function at the entry to a control flow node:
//
//               Known*
//                 |
//              Unknown
//
export type BlockState = Unknown | Known;
type Unknown = ["Unknown"];
type Known = ["Known", VariableState[]];

function is_bottom(b: BlockState): b is Unknown {
  return b[0] === "Unknown";
}
function is_known(b: BlockState): b is Known {
  return b[0] === "Known";
}

export function is_equal(left: BlockState, right: BlockState): boolean {
  if (left[0] === "Unknown" && right[0] === "Unknown") {
    return true;
  } else if (left[0] === "Known" && right[0] === "Known") {
    assert(
      left[0].length === right[0].length,
      "Arrays must be of equal length.",
    );
    const mismatch: undefined | VariableState = left[1].find((_, i) =>
      left[1][i] !== right[1][i]
    );
    return mismatch === undefined;
  } else {
    return false;
  }
}

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

export function join_block(left: BlockState, right: BlockState): BlockState {
  if (is_bottom(left) && is_bottom(right)) {
    return left;
  } else if (is_bottom(left) && is_known(right)) {
    return right;
  } else if (is_known(left) && is_bottom(right)) {
    return left;
  } else if (is_known(left) && is_known(right)) {
    const left_vector: VariableState[] = left[1];
    const right_vector: VariableState[] = right[1];
    assert(
      left_vector.length === right_vector.length,
      `Vectors of variables must be of the same length: ${left_vector.length} != ${right_vector.length}`,
    );
    // element-wise join of variables
    const result: VariableState[] = left_vector.map(function (_vs, i) {
      return join_variable(left_vector[i], right_vector[i]);
    });
    return ["Known", result];
  } else {
    return left as never;
  }
}

export function join_variable(
  left: VariableState,
  right: VariableState,
): VariableState {
  if (left === right) {
    return structuredClone(left);
  } else {
    return "Ambiguous";
  }
}
