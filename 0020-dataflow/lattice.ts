// Copyright (c) 2026 Marco Nikander

export type Element = "bottom" | "defined" | "dropped" | "top";
export type State = ["ok", Element] | ["error", Element, string];

export function is_ok(result: State): boolean {
  return result[0] === "ok";
}

export function get_state(result: State): Element {
  return result[1];
}

export function join_state(left: State, right: State): State {
  if (!is_ok(left)) {
    return left;
  } else if (!is_ok(right)) {
    return right;
  } else {
    return ["ok", join(left[1], right[1])];
  }
}

export function join(left: Element, right: Element): Element {
  if (left === right) {
    return left;
  } else {
    return "top";
  }
}

export function define(state: State): State {
  if (state[0] == "ok") {
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
