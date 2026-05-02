import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as Grammar from "./anf_like_grammar.ts";

describe("tuple-based grammar", () => {
  it("must allow an empty block", () => {
    const _text: string = "{unit}";
    const input: Grammar.Block = ["block", [], ["unit"]];
    expect(input).toBeDefined();
  });

  it("must allow simple arithmetic expressions", () => {
    const _text: string = "{+ 1 2}";
    const input: Grammar.Block = ["block", [], ["binary", "+", [["int", 1], [
      "int",
      2,
    ]]]];
    expect(input).toBeDefined();
  });

  it("must allow nested arithmetic expressions", () => {
    const _text: string = "{+ 1 {+ 2 3}}";
    const input: Grammar.Block = ["block", [], ["binary", "+", [["int", 1], [
      "block",
      [],
      ["binary", "+", [["int", 2], ["int", 3]]],
    ]]]];
    expect(input).toBeDefined();
  });

  it("must allow arithmetic let-bindings", () => {
    const _text: string = "{+ 1 { let x = + 2 3 in x }}";
    const input: Grammar.Block = [
      "block",
      [],
      ["binary", "+", [["int", 1], [
        "block",
        [
          ["let", ["id", "x"], ["binary", "+", [["int", 2], ["int", 3]]]],
        ],
        ["id", "x"],
      ]]],
    ];
    expect(input).toBeDefined();
  });
});
