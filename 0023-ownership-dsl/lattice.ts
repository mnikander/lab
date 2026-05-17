// Copyright (c) 2026 Marco Nikander

import * as G from "./grammar.ts";

export type State = (Message | Element)[];

export type Element =
  | readonly ["top"]
  | readonly ["dropped"]
  | readonly ["defined"]
  | readonly ["undefined"]
  | readonly ["bottom"];

export function is_element(result: Message | Element): result is Element {
  return result[0] === "top" ||
    result[0] === "dropped" ||
    result[0] === "defined" || result[0] === "undefined" ||
    result[0] === "bottom";
}

export type Message = ["error", string];

export function equal(left: State, right: State): boolean {
  return left.every((_e, i) => {
    return left[i][0] === right[i][0];
  });
}

export function join(left: State, right: State): State {
  return left.map((_e, i) => join_element(left[i], right[i]));
}

function join_element(
  left: Message | Element,
  right: Message | Element,
): Message | Element {
  if (left[0] === "error") {
    return left;
  } else if (right[0] === "error") {
    return right;
  } else if (left[0] === "top" || right[0] === "top") {
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

export function make_updater(
  func: G.Function,
): (index: number, in_state: State) => State {
  const metadata: G.Metadata = [...func[2], ...func[3]];

  // dataflow on the level of a block
  return function update(
    index: number,
    in_state: State,
  ): State {
    const blocks: G.Block[] = func[4];
    const lines: G.Line[] = blocks[index][1];
    let mutable: State = in_state.map((e) => e); // fresh copy
    lines.forEach((line) => {
      if (G.is_body(line)) {
        mutable = update_line(line, mutable);
      } else if (G.is_branch(line)) {
        // no state update is necessary
      } else if (G.is_return(line)) {
        mutable = update_return(line, mutable, metadata);
      } else {
        throw Error("Bug: unknown instruction");
      }
    });

    // this is super important: after processing a block, any remaining "bottom" entries must be changed to "undefined"
    const no_bottom: State = mutable.map((entry) => {
      return entry[0] === "bottom" ? ["undefined"] : entry;
    });
    return no_bottom;
  };
}

// in-place update of State
function update_return(
  line: G.Return,
  mutable: State,
  metadata: G.Metadata,
): State {
  const result: number = line[1];
  if (mutable[result] === undefined) {
    throw Error("Bug: unknown register");
  } else {
    const result: number = line[1];
    mutable.map((_s, i) => {
      if (i === result) {
        mutable[i] = validate_result(mutable[i], metadata[i]);
      } else {
        mutable[i] = validate_non_result(mutable[i], metadata[i]);
      }
    });
    return mutable;
  }
}

function validate_result(
  entry: Message | Element,
  annotation: G.Parameter | G.Alloca,
): Message | Element {
  if (!is_element(entry)) {
    return entry;
  } else {
    const scope: "local" | "caller" | "global" = annotation[1][0];
    const type: "basic" | "pointer" = annotation[1][2];
    if (scope === "local" && type === "pointer") {
      return [
        "error",
        "dangling pointer, can't return a pointer to a local variable",
      ];
    } else {
      return apply_return(entry);
    }
  }
}

function validate_non_result(
  entry: Message | Element,
  annotation: G.Parameter | G.Alloca,
): Message | Element {
  const is_valid: boolean = is_element(entry);
  const is_linear: boolean = annotation[1][1] === "linear";
  if (is_valid && is_linear && entry[0] !== "dropped") {
    return ["error", "linear variable was not dropped"];
  } else {
    return entry; // do nothing
  }
}

// in-place update of State
function update_line(
  line: G.Define | G.Use | G.Drop,
  mutable: State,
): State {
  const register: number = line[1];
  if (mutable[register] === undefined) {
    throw Error("Bug: unknown register");
  } else {
    switch (line[0]) {
      case "define":
        mutable[register] = apply_define(mutable[register]);
        break;
      case "use":
        mutable[register] = apply_use(mutable[register]);
        break;
      case "drop":
        mutable[register] = apply_drop(mutable[register]);
        break;
      default:
        throw Error("Bug: unknown instruction");
    }
    return mutable;
  }
}

// Note that the SSA property ensures there is only one definition in the
// source code, so multiple passes over define must be due to loops.
// Thus, we just treat 'define' as a reset of the variable item.
function apply_define(item: Message | Element): Message | Element {
  if (!is_element(item)) {
    return item;
  } else {
    switch (item[0]) {
      case "top":
        return ["defined"];
      case "dropped":
        return ["defined"];
      case "defined":
        return ["defined"];
      case "undefined":
        return ["defined"];
      case "bottom":
        return ["defined"];
      default:
        throw Error("Bug: invalid transition");
    }
  }
}

function apply_use(item: Message | Element): Message | Element {
  if (!is_element(item)) {
    return item;
  } else {
    switch (item[0]) {
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
        throw Error("Bug: invalid transition");
    }
  }
}

function apply_drop(item: Message | Element): Message | Element {
  if (!is_element(item)) {
    return item;
  } else {
    switch (item[0]) {
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
        throw Error("Bug: invalid transition");
    }
  }
}

function apply_return(item: Message | Element): Message | Element {
  if (!is_element(item)) {
    return item;
  } else {
    switch (item[0]) {
      case "top":
        return ["error", "potential return-before-define / return-after-free"];
      case "dropped":
        return ["error", "return-after-free"];
      case "defined":
        return ["defined"];
      case "undefined":
        return ["error", "return-before-define"];
      case "bottom":
        return ["error", "return-before-define"];
      default:
        throw Error("Bug: invalid transition");
    }
  }
}
