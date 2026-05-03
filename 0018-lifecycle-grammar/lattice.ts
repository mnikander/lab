// Copyright (c) 2026 Marco Nikander

export type State = "top" | "pre" | "live" | "post" | "bottom";
export type Success = ["ok"] | ["error", string];

export function define(state: State): [State, Success] {
  switch (state) {
    case "top":
      return ["top", [
        "error",
        "potential define-after-define / define-after-free",
      ]];
    case "post":
      return ["top", ["error", "define-after-free"]];
    case "live":
      return ["top", ["error", "define-after-define"]];
    case "pre":
      return ["live", ["ok"]];
    default:
      return ["bottom", ["error", "invalid state transition"]];
  }
}

export function use(state: State): [State, Success] {
  switch (state) {
    case "top":
      return ["top", ["error", "potential use-before-define / use-after-free"]];
    case "post":
      return ["top", ["error", "use-after-free"]];
    case "live":
      return ["live", ["ok"]];
    case "pre":
      return ["top", ["error", "use-before-define"]];
    default:
      return ["bottom", ["error", "invalid state transition"]];
  }
}

export function free(state: State): [State, Success] {
  switch (state) {
    case "top":
      return ["top", [
        "error",
        "potential free-before-define / free-after-free",
      ]];
    case "post":
      return ["top", ["error", "free-after-free"]];
    case "live":
      return ["post", ["ok"]];
    case "pre":
      return ["top", ["error", "free-before-define"]];
    default:
      return ["bottom", ["error", "invalid state transition"]];
  }
}
