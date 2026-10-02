// Copyright (c) 2026 Marco Nikander

// State of the function at the entry to a control flow node:
//
//               Known*
//                 |
//               Bottom
//
export type BlockState = Bottom | Known;
type Bottom = ["Bottom"];
type Known = ["Known", VariableState[]];

function is_bottom(b: BlockState): b is Bottom {
  return b[0] === "Bottom";
}
function is_known(b: BlockState): b is Known {
  return b[0] === "Known";
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
  | "Undefined"
  | "Available"
  | "Destroyed"
  | "Ambiguous";

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
    if (left_vector.length !== right_vector.length) {
      throw Error(
        `Vectors of variables must be of the same length: ${left_vector.length} != ${right_vector.length}`,
      );
    } else {
      // elmentwise join of variables
      const result: VariableState[] = left_vector.map(function (_vs, i) {
        return join_variable(left_vector[i], right_vector[i]);
      });
      return ["Known", result];
    }
  } else {
    return left as never;
  }
}

export function join_variable(
  left: VariableState,
  right: VariableState,
): VariableState {
  if (left === right) {
    // TODO: does this actually ensure that the value is copied, rather than the pointer to the value?
    return ((e) => e)(left);
  } else {
    return "Ambiguous";
  }
}
