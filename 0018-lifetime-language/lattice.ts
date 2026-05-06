// Copyright (c) 2026 Marco Nikander

export type State = "top" | "pre" | "available" | "post" | "bottom";
export type Result = ["ok", State] | ["error", State, string];

export function is_ok(result: Result): boolean {
  return result[0] === "ok";
}

export function get_state(result: Result): State {
  return result[1];
}

export function define(state: Result): Result {
  if (state[0] == "ok") {
    switch (state[1]) {
      case "top":
        return [
          "error",
          "top",
          "potential define-after-define / define-after-free",
        ];
      case "post":
        return ["error", "top", "define-after-free"];
      case "available":
        return ["error", "top", "define-after-define"];
      case "pre":
        return ["ok", "available"];
      default:
        return ["error", "bottom", "invalid state transition"];
    }
  } else {
    return state;
  }
}

export function use(state: Result): Result {
  if (state[0] == "ok") {
    switch (state[1]) {
      case "top":
        return ["error", "top", "potential use-before-define / use-after-free"];
      case "post":
        return ["error", "top", "use-after-free"];
      case "available":
        return ["ok", "available"];
      case "pre":
        return ["error", "top", "use-before-define"];
      default:
        return ["error", "bottom", "invalid state transition"];
    }
  } else {
    return state;
  }
}

export function free(state: Result): Result {
  if (state[0] == "ok") {
    switch (state[1]) {
      case "top":
        return [
          "error",
          "top",
          "potential free-before-define / free-after-free",
        ];
      case "post":
        return ["error", "top", "free-after-free"];
      case "available":
        return ["ok", "post"];
      case "pre":
        return ["error", "top", "free-before-define"];
      default:
        return ["error", "bottom", "invalid state transition"];
    }
  } else {
    return state;
  }
}
