import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as Grammar from "./relaxed_grammar.ts";

describe("tuple-based grammar", () => {
  it("must allow an empty block", () => {
    const _text: string = "{unit}";
    const input: Grammar.Expression = [
      "let",
      [
        ["main", ["func", [], ["unit"]]],
      ],
      "in",
      ["call", "main", [["unit"]]],
    ];
    expect(input).toBeDefined();
  });

  it("must allow simple arithmetic expressions", () => {
    const _text: string = "{+ 1 2}";
    const input: Grammar.Expression = ["call", "+", [["int", 1], ["int", 2]]];
    expect(input).toBeDefined();
  });

  it("must allow nested arithmetic expressions", () => {
    const _text: string = "{+ 1 {+ 2 3}}";
    const input: Grammar.Expression = ["call", "+", [["int", 1], ["call", "+", [
      ["int", 2],
      ["int", 3],
    ]]]];
    expect(input).toBeDefined();
  });

  it("must allow arithmetic let-bindings", () => {
    const _text: string = "{+ 1 { let x = + 2 3 in x }}";
    const input: Grammar.Expression = ["call", "+", [["int", 1], [
      "let",
      [[
        "x",
        ["call", "+", [["int", 2], ["int", 3]]],
      ]],
      "in",
      "x",
    ]]];
    expect(input).toBeDefined();
  });
});
