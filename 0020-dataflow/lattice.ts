// Copyright (c) 2026 Marco Nikander

import { assert } from "node:console";
import { fill } from "./worklist.ts";

export type State = ["bottom"] | ["defined"] | ["dropped"] | ["top", string];

export function is_ok(result: State): boolean {
  return result[0] === "bottom" || result[0] === "defined" ||
    result[0] === "dropped";
}

export function default_states(variable_count: number): State[] {
  return fill(variable_count, ["bottom"]);
}

export function find_errors(
  states: State[],
): number[] {
  const zipped: [number, State][] = states.map((s, i) => [i, s]);
  const filtered: [number, State][] = zipped.filter((e) => !is_ok(e[1]));
  const result: number[] = filtered.map((e) => e[0]);
  return result;
}

export function equal_states(left: State[], right: State[]): boolean {
  const element_wise: boolean[] = left.map((_s, i) => {
    return (left[i][0] === right[i][0] && left[i][1] === right[i][1]);
  });
  const all_equal: boolean = element_wise.reduce((acc: boolean, c: boolean) => {
    return acc && c;
  }, true);
  return all_equal;
}

export function join_states(left: State[], right: State[]): State[] {
  assert(left.length === right.length, "State arrays must be of equal length");
  const result: State[] = left.map((_s, i) => join(left[i], right[i]));
  return result;
}

function join(left: State, right: State): State {
  if (!is_ok(left)) {
    return left;
  } else if (!is_ok(right)) {
    return right;
  } else if (left === right) {
    return left;
  } else {
    return ["top", "ambiguous join"];
  }
}

export function define(state: State): State {
  if (is_ok(state)) {
    switch (state[0]) {
      case "top":
        return [
          "top",
          "potential define-after-define / define-after-free",
        ];
      case "dropped":
        return ["top", "define-after-free"];
      case "defined":
        return ["top", "define-after-define"];
      case "bottom":
        return ["defined"];
      default:
        return ["top", "invalid state transition"];
    }
  } else {
    return state;
  }
}

export function use(state: State): State {
  if (is_ok(state)) {
    switch (state[0]) {
      case "top":
        return ["top", "potential use-before-define / use-after-free"];
      case "dropped":
        return ["top", "use-after-free"];
      case "defined":
        return ["defined"];
      case "bottom":
        return ["top", "use-before-define"];
      default:
        return ["top", "invalid state transition"];
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
          "top",
          "potential free-before-define / free-after-free",
        ];
      case "dropped":
        return ["top", "free-after-free"];
      case "defined":
        return ["dropped"];
      case "bottom":
        return ["top", "free-before-define"];
      default:
        return ["top", "invalid state transition"];
    }
  } else {
    return state;
  }
}
