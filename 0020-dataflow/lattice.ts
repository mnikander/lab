// Copyright (c) 2026 Marco Nikander

import { assert } from "node:console";
import { fill } from "./worklist.ts";

export type Element = "bottom" | "defined" | "dropped" | "top";
export type State = ["ok", Element] | ["error", Element, string];

export function is_ok(result: State): boolean {
  return result[0] === "ok";
}

export function get_state(result: State): Element {
  return result[1];
}

export function default_states(variable_count: number): State[] {
  return fill(variable_count, ["ok", "bottom"]);
}

export function find_errors(
  states: State[],
): number[] {
  const zipped: [number, State][] = states.map((s, i) => [i, s]);
  const filtered: [number, State][] = zipped.filter((e) => e[1][0] === "error");
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
  const result: State[] = left.map((_s, i) => join_state(left[i], right[i]));
  return result;
}

function join_state(left: State, right: State): State {
  if (!is_ok(left)) {
    return left;
  } else if (!is_ok(right)) {
    return right;
  } else {
    return ["ok", join(left[1], right[1])];
  }
}

function join(left: Element, right: Element): Element {
  if (left === right) {
    return left;
  } else {
    return "top";
  }
}

export function define(state: State): State {
  if (is_ok(state)) {
    switch (state[1]) {
      case "top":
        return [
          "error",
          "top",
          "potential define-after-define / define-after-free",
        ];
      case "dropped":
        return ["error", "top", "define-after-free"];
      case "defined":
        return ["error", "top", "define-after-define"];
      case "bottom":
        return ["ok", "defined"];
      default:
        return ["error", "bottom", "invalid state transition"];
    }
  } else {
    return state;
  }
}

export function use(state: State): State {
  if (is_ok(state)) {
    switch (state[1]) {
      case "top":
        return ["error", "top", "potential use-before-define / use-after-free"];
      case "dropped":
        return ["error", "top", "use-after-free"];
      case "defined":
        return ["ok", "defined"];
      case "bottom":
        return ["error", "top", "use-before-define"];
      default:
        return ["error", "bottom", "invalid state transition"];
    }
  } else {
    return state;
  }
}

export function drop(state: State): State {
  if (is_ok(state)) {
    switch (state[1]) {
      case "top":
        return [
          "error",
          "top",
          "potential free-before-define / free-after-free",
        ];
      case "dropped":
        return ["error", "top", "free-after-free"];
      case "defined":
        return ["ok", "dropped"];
      case "bottom":
        return ["error", "top", "free-before-define"];
      default:
        return ["error", "bottom", "invalid state transition"];
    }
  } else {
    return state;
  }
}
