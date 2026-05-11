// Copyright (c) 2026 Marco Nikander

import { assert } from "node:console";
import { fill } from "./worklist.ts";

export type State =
  | readonly ["bottom"]
  | readonly ["undefined"]
  | readonly ["defined"]
  | readonly ["dropped"]
  | readonly ["top"]
  | readonly ["error", string];

export function is_ok(result: State): boolean {
  return result[0] === "bottom" || result[0] === "undefined" ||
    result[0] === "defined" ||
    result[0] === "dropped" || result[0] === "top";
}

export function default_states(variable_count: number): State[] {
  return fill(variable_count, ["bottom"]);
}

export function find_errors(
  states: readonly State[],
): number[] {
  const zipped: [number, State][] = states.map((s, i) => [i, s]);
  const filtered: [number, State][] = zipped.filter((e) => !is_ok(e[1]));
  const result: number[] = filtered.map((e) => e[0]);
  return result;
}

export function equal_states(
  left: readonly State[],
  right: readonly State[],
): boolean {
  const element_wise: boolean[] = left.map((_s, i) => {
    return (left[i][0] === right[i][0] && left[i][1] === right[i][1]);
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
  assert(left.length === right.length, "State arrays must be of equal length");
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

export function define(state: State): State {
  if (is_ok(state)) {
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

export function use(state: State): State {
  if (is_ok(state)) {
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

export function drop(state: State): State {
  if (is_ok(state)) {
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
