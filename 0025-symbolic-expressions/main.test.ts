import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import * as S from "./grammar.ts";

describe("atoms", () => {
  it("single variable", () => {
    const expr: S.Variable = "x";
    expect(expr).toBeDefined();
  });
  
  it("single boolean literal", () => {
    const expr: S.Boolean = true;
    expect(expr).toBeDefined();
  });
  
  it("single number literal", () => {
    const expr: S.Number = 42;
    expect(expr).toBeDefined();
  });
});

describe("lists", () => {
  it("empty list", () => {
    const expr: S.Expr = [];
    expect(expr).toBeDefined();
  });
  
  it("add", () => {
    const expr: S.List = ["add", 1, 2];
    expect(expr).toBeDefined();
  });

  it("simple let-binding", () => {
    const expr: S.List = ["let", "x", 42];
    expect(expr).toBeDefined();
  });
});

describe("nested lists", () => {
  it("nested equation", () => {
    const expr: S.List = ["multiply", ["add", 1, 2], ["subtract", 5, 2]];
    expect(expr).toBeDefined();
  });

  it("simple let-binding", () => {
    const expr: S.List = ["list", 1, ["list", 2, ["list", 3, []]]];
    expect(expr).toBeDefined();
  });
});

