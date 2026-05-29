import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import * as G from "./grammar.ts";
import { compute_dependencies, Deps } from "./main.ts";

describe("simple examples", () => {
  it("return a constant", () => {
    const fun: G.Function = [
      "func",
      ["result", "int", ["local", "cloneable", "no_destructor"]],
      [],
      [["alloca", "int", ["local", "cloneable", "no_destructor"]]],
      [["block", [
        [0, "constant"],
        [null, "return", 0],
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
      ["result", "int", ["local", "cloneable", "no_destructor"]],
      [
        ["param", "int", ["local", "cloneable", "no_destructor"]],
        ["param", "int", ["local", "cloneable", "no_destructor"]],
      ],
      [["alloca", "int", ["local", "cloneable", "no_destructor"]]],
      [["block", [
        [2, "add", 0, 1],
        [null, "return", 2],
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
      ["result", "int", ["local", "cloneable", "no_destructor"]],
      [["param", "int", ["local", "cloneable", "no_destructor"]]],
      [],
      [["block", [
        [null, "return", 0],
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
      ["result", "pointer", ["local", "cloneable", "no_destructor"]],
      [["param", "pointer", ["caller", "cloneable", "no_destructor"]]], // allowed to escape
      [],
      [["block", [
        [null, "return", 0],
      ]]],
    ];
    const expected: Deps = [["register", 0, [["abstract_token", 0]]]];
    const actual: Deps = compute_dependencies(fun);
    expect(actual.length).toBe(1);
    expect(actual).toEqual(expected);
  });
});
