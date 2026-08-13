import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as S from "./grammar.ts";

describe("valid atoms", () => {
  it("symbol", () => {
    const expr: S.Symbol = "x";
    expect(S.is_symbol(expr)).toBe(true);
    expect(S.is_string(expr)).toBe(false);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_atom(expr)).toBe(true);
    expect(S.is_list(expr)).toBe(false);
  });

  it("boolean literal", () => {
    const expr: S.Boolean = true;
    expect(S.is_boolean(expr)).toBe(true);
  });

  it("number literal", () => {
    const expr: S.Number = 42;
    expect(S.is_number(expr)).toBe(true);
  });

  it("string literal", () => {
    const expr: S.String = "'hello world'";
    expect(S.is_string(expr)).toBe(true);
  });
});

describe("invalid atoms", () => {
  it("symbol with whitespace", () => {
    const expr: S.Expr = "hello world";
    expect(S.is_expr(expr)).toBe(false);
  });

  it("quote at the beginning", () => {
    const expr: S.Expr = "'x";
    expect(S.is_expr(expr)).toBe(false);
  });

  it("quote at the end", () => {
    const expr: S.Expr = "x'";
    expect(S.is_expr(expr)).toBe(false);
  });
});

describe("valid lists", () => {
  it("empty list", () => {
    const expr: S.Expr = [];
    expect(S.is_symbol(expr)).toBe(false);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_atom(expr)).toBe(false);
    expect(S.is_list(expr)).toBe(true);
    expect(S.is_expr(expr)).toBe(true);
  });

  it("add", () => {
    const expr: S.List = ["add", 1, 2];
    expect(S.is_symbol(expr)).toBe(false);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_atom(expr)).toBe(false);
    expect(S.is_list(expr)).toBe(true);
  });

  it("simple let-binding", () => {
    const expr: S.List = ["let", "x", 42];
    expect(S.is_list(expr)).toBe(true);
  });
});

describe("invalid lists", () => {
  it("untagged list", () => {
    const expr: S.Expr = [1];
    expect(S.is_symbol(expr)).toBe(false);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_atom(expr)).toBe(false);
    expect(S.is_list(expr)).toBe(false);
    expect(S.is_expr(expr)).toBe(false);
  });

  it("list starting with a string", () => {
    const expr: S.Expr = ["'1'"];
    expect(S.is_symbol(expr)).toBe(false);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_atom(expr)).toBe(false);
    expect(S.is_list(expr)).toBe(false);
    expect(S.is_expr(expr)).toBe(false);
  });
});

describe("nested lists", () => {
  it("nested equation", () => {
    const expr: S.List = ["multiply", ["add", 1, 2], ["subtract", 5, 2]];
    expect(S.is_list(expr)).toBe(true);
  });

  it("simple let-binding", () => {
    const expr: S.List = ["list", 1, ["list", 2, ["list", 3, []]]];
    expect(S.is_list(expr)).toBe(true);
  });
});
