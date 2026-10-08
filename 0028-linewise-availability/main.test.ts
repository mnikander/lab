import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { linewise_availability } from "./main.ts";
import { Result } from "./result.ts";
import { Block } from "./grammar.ts";
import { VariableState } from "./lattice.ts";

const empty_block: Block = ["block", ["bindings"], ["instructions"]];

describe("empty block", () => {
  it("must accept empty input", () => {
    const result: Result<VariableState[]> = linewise_availability(
      [],
      [],
      empty_block,
    );
    expect(result[0]).toEqual("ok");
  });

  it("must return availabilities unchanged", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Undefined", "Available", "Destroyed", "Ambiguous"],
      [[], [], [], []],
      empty_block,
    );
    expect(result[0]).toEqual("ok");
    expect(result[1][0]).toEqual("Undefined");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Destroyed");
    expect(result[1][3]).toEqual("Ambiguous");
  });
});

describe("invalid input", () => {
  it("must throw on missing input availability", () => {
    expect(() => linewise_availability([], [["%0"]], empty_block)).toThrow();
  });

  it("must throw on missing points-to set", () => {
    expect(() => linewise_availability(["Available"], [], empty_block))
      .toThrow();
  });

  it("must throw on unequal lengths", () => {
    expect(() => linewise_availability(["Available"], [[], []], empty_block))
      .toThrow();
  });
});

describe("simple operations", () => {
  it("must accept valid define and use", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Undefined"],
      [[]],
      ["block", ["bindings"], [
        "instructions",
        ["let", "%0", ["unary", ["constant", 42]]],
        ["return", "%0"],
      ]],
    );
    expect(result[0]).toEqual("ok");
  });

  it.skip("must reject return of 'Undefined' variable", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Undefined"],
      [[]],
      ["block", ["bindings"], ["instructions", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must reject return of 'Destroyed' variable", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Destroyed"],
      [[]],
      ["block", ["bindings"], ["instructions", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must reject return of 'Ambiguous' variable", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Ambiguous"],
      [[]],
      ["block", ["bindings"], ["instructions", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must accept valid define-use-drop", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Undefined"],
      [[]],
      ["block", ["bindings"], [
        "instructions",
        ["let", "%0", ["unary", ["constant", 42]]],
        ["let", "%1", ["unary", ["constant", 5]]],
        ["drop", "%1"],
        ["return", "%0"],
      ]],
    );
    expect(result[0]).toEqual("ok");
  });

  it.skip("must reject double-drop", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Ambiguous"],
      [[]],
      ["block", ["bindings"], [
        "instructions",
        ["let", "%0", ["unary", ["constant", 42]]],
        ["let", "%1", ["unary", ["constant", 5]]],
        ["drop", "%1"],
        ["drop", "%1"],
        ["return", "%0"],
      ]],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept valid return of predefined variable", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Available"],
      [[]],
      ["block", ["bindings"], ["instructions", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("ok");
  });

  it.skip("must reject return of ambiguous variable", () => {
    const result: Result<VariableState[]> = linewise_availability(
      ["Ambiguous"],
      [[]],
      ["block", ["bindings"], ["instructions", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });
});
