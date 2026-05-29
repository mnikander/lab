import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";

import * as G from "./grammar.ts";
import { compute_dependencies } from "./main.ts";

describe("simple examples", () => {
  it("must accept a trivial program", () => {
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
    const expected: number[][] = [[]];
    const actual: number[][] = compute_dependencies(fun);
    expect(actual.length).toBe(1);
    expect(actual).toEqual(expected);
  });
});
