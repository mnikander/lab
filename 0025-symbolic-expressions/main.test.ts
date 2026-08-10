import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as S from "./grammar.ts";

describe("atoms", () => {
  it("single variable", () => {
    const expr: S.Variable = "x";
    expect(S.is_variable(expr)).toBe(true);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_list(expr)).toBe(false);
  });
  
  it("single boolean literal", () => {
    const expr: S.Boolean = true;
    expect(S.is_boolean(expr)).toBe(true);
  });
  
  it("single number literal", () => {
    const expr: S.Number = 42;
    expect(S.is_number(expr)).toBe(true);
  });
});

describe("lists", () => {
  it("empty list", () => {
    const expr: S.Expr = [];
    expect(S.is_variable(expr)).toBe(false);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_list(expr)).toBe(true);
  });
  
  it("add", () => {
    const expr: S.List = ["add", 1, 2];
    expect(S.is_variable(expr)).toBe(false);
    expect(S.is_boolean(expr)).toBe(false);
    expect(S.is_number(expr)).toBe(false);
    expect(S.is_list(expr)).toBe(true);
  });

  it("simple let-binding", () => {
    const expr: S.List = ["let", "x", 42];
    expect(S.is_list(expr)).toBe(true);
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

