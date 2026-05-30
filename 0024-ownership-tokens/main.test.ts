import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import * as G from "./grammar.ts";
import { compute_dependencies, Deps } from "./main.ts";

function int(): G.Token {
  return ["token", "local", "cloneable", "no_drop", ["int"]];
}

function borrow(token: G.Token): G.Token {
  return ["token", "local", "cloneable", "no_drop", ["borrowed", token]];
}

function own(token: G.Token): G.Token {
  return ["token", "local", "cloneable", "no_drop", ["owned", token]];
}

function caller(token: G.Token): G.Token {
  token[1] = "caller";
  return token;
}

function unique(token: G.Token): G.Token {
  token[2] = "unique";
  return token;
}

function must_drop(token: G.Token): G.Token {
  token[3] = "must_drop";
  return token;
}

describe("simple examples", () => {
  it("return a constant", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [],
      [["alloca", int()]],
      [["block", [
        ["assign", 0, "constant"],
        ["return", 0],
      ]]],
    ];
    const expected: Deps = [["register", 0, []]];
    const actual: Deps = compute_dependencies(fun);
    expect(actual.length).toBe(1);
    expect(actual).toEqual(expected);
  });

  it("add two arguments", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [
        ["param", int()],
        ["param", int()],
      ],
      [
        ["alloca", int()],
      ],
      [["block", [
        ["assign", 2, "add", 0, 1],
        ["return", 2],
      ]]],
    ];
    const expected: Deps = [
      ["register", 0, []],
      ["register", 1, []],
      ["register", 2, []],
    ];
    const actual: Deps = compute_dependencies(fun);
    expect(actual.length).toBe(3);
    expect(actual).toEqual(expected);
  });

  it("identity function on integers", () => {
    const fun: G.Function = [
      "func",
      ["result", int()],
      [["param", int()]],
      [],
      [["block", [
        ["return", 0],
      ]]],
    ];
    const expected: Deps = [["register", 0, []]];
    const actual: Deps = compute_dependencies(fun);
    expect(actual.length).toBe(1);
    expect(actual).toEqual(expected);
  });

  it("identity function on borrows", () => {
    const fun: G.Function = [
      "func",
      ["result", borrow(int())],
      [["param", caller(borrow(caller(int())))]], // allowed to escape
      [],
      [["block", [
        ["return", 0],
      ]]],
    ];
    const expected: Deps = [["register", 0, [["abstract_token", 0]]]];
    const actual: Deps = compute_dependencies(fun);
    expect(actual.length).toBe(1);
    expect(actual).toEqual(expected);
  });
});
