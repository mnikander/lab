// Copyright (c) 2026 Marco Nikander

import { fill } from "./worklist.ts";

export type Error = readonly ["error", string];

export type State =
  | readonly ["top"]
  | readonly ["dropped"]
  | readonly ["defined"]
  | readonly ["undefined"]
  | readonly ["bottom"];

export function is_state(result: Error | State): result is State {
  return result[0] === "top" ||
    result[0] === "dropped" ||
    result[0] === "defined" || result[0] === "undefined" ||
    result[0] === "bottom";
}

export function default_states(variable_count: number): State[] {
  return fill(variable_count, ["bottom"]);
}

export function equal_states(
  left: readonly State[],
  right: readonly State[],
): boolean {
  const element_wise: boolean[] = left.map((_s, i) => {
    return (left[i][0] === right[i][0]);
  });
  const all_equal: boolean = element_wise.reduce((acc: boolean, c: boolean) => {
    return acc && c;
  }, true);
  return all_equal;
}

export function join_states(
  left: readonly State[],
  right: readonly State[],
): State[] {
  const result: State[] = left.map((_s, i) => join(left[i], right[i]));
  return result;
}

function join(left: State, right: State): State {
  if (left[0] === "top" || right[0] === "top") {
    return ["top"];
  } else if (left[0] === "bottom") {
    return right;
  } else if (right[0] === "bottom") {
    return left;
  } else if (left[0] === right[0]) {
    return left;
  } else {
    return ["top"];
  }
}

export function define(state: State): Error | State {
  if (is_state(state)) {
    switch (state[0]) {
      case "top":
        return [
          "error",
          "potential define-after-define / define-after-free",
        ];
      case "dropped":
        return ["error", "define-after-free"];
      case "defined":
        return ["error", "define-after-define"];
      case "undefined":
        return ["defined"];
      case "bottom":
        return ["defined"];
      default:
        return ["error", "invalid state transition"];
    }
  } else {
    return state;
  }
}

export function use(state: State): Error | State {
  if (is_state(state)) {
    switch (state[0]) {
      case "top":
        return ["error", "potential use-before-define / use-after-free"];
      case "dropped":
        return ["error", "use-after-free"];
      case "defined":
        return ["defined"];
      case "undefined":
        return ["error", "use-before-define"];
      case "bottom":
        return ["error", "use-before-define"];
      default:
        return ["error", "invalid state transition"];
    }
  } else {
    return state;
  }
}

export function drop(state: State): Error | State {
  if (is_state(state)) {
    switch (state[0]) {
      case "top":
        return [
          "error",
          "potential free-before-define / free-after-free",
        ];
      case "dropped":
        return ["error", "free-after-free"];
      case "defined":
        return ["dropped"];
      case "undefined":
        return ["error", "free-before-define"];
      case "bottom":
        return ["error", "free-before-define"];
      default:
        return ["error", "invalid state transition"];
    }
  } else {
    return state;
  }
}
