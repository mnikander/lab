import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as Grammar from "./anf_like_grammar.ts";

describe("tuple-based grammar", () => {
  it("must allow an empty block", () => {
    const _text: string = "{unit}";
    const input: Grammar.Block = ["block", [], ["unit"]];
    expect(input).toBeDefined();
  });

  it("must allow defining a function", () => {
    const _text: string = "{unit}";
    const input: Grammar.Block = [
      "block",
      [
        ["let", "main", ["func", [], ["block", [], ["unit"]]]],
      ],
      ["call", "main", [["unit"]]],
    ];
    expect(input).toBeDefined();
  });

  it("must allow simple arithmetic expressions", () => {
    const _text: string = "{+ 1 2}";
    const input: Grammar.Block = ["block", [], ["call", "+", [["int", 1], [
      "int",
      2,
    ]]]];
    expect(input).toBeDefined();
  });

  it("must allow nested arithmetic expressions", () => {
    const _text: string = "{+ 1 {+ 2 3}}";
    const input: Grammar.Block = ["block", [], ["call", "+", [["int", 1], [
      "block",
      [],
      ["call", "+", [["int", 2], ["int", 3]]],
    ]]]];
    expect(input).toBeDefined();
  });

  it("must allow arithmetic let-bindings", () => {
    const _text: string = "{+ 1 { let x = + 2 3 in x }}";
    const input: Grammar.Block = [
      "block",
      [],
      ["call", "+", [["int", 1], [
        "block",
        [
          ["let", "x", ["call", "+", [["int", 2], ["int", 3]]]],
        ],
        "x",
      ]]],
    ];
    expect(input).toBeDefined();
  });

  it("must allow conditionals in let-bindings", () => {
    const _text: string = "let x = 5 in if > x 0 then 1 else -1";
    const input: Grammar.Block = ["block", [], [
      "if",
      ["block", [], ["call", ">", ["x", ["int", 0]]]],
      ["int", 1],
      ["int", -1],
    ]];
    expect(input).toBeDefined();
  });
});
