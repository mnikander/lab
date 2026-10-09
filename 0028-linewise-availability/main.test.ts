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
      empty_block,
      [],
      [],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(0);
  });

  it("must return availabilities unchanged", () => {
    const result: Result<VariableState[]> = linewise_availability(
      empty_block,
      [[], [], [], []],
      ["Undefined", "Available", "Destroyed", "Ambiguous"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(4);
    expect(result[1][0]).toEqual("Undefined");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Destroyed");
    expect(result[1][3]).toEqual("Ambiguous");
  });
});

describe("invalid input", () => {
  it("must throw on missing input availability", () => {
    expect(() =>
      linewise_availability(
        empty_block,
        [["%0"]],
        [],
      )
    ).toThrow();
  });

  it("must throw on missing points-to set", () => {
    expect(() =>
      linewise_availability(
        empty_block,
        [],
        ["Available"],
      )
    )
      .toThrow();
  });

  it("must throw on unequal lengths", () => {
    expect(() =>
      linewise_availability(
        empty_block,
        [[], []],
        ["Available"],
      )
    )
      .toThrow();
  });
});

describe("integer resources", () => {
  it("must accept valid define and use", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(1);
    expect(result[1][0]).toEqual("Available");
  });

  it("must reject return of 'Undefined' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject return of 'Destroyed' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Destroyed"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject return of 'Ambiguous' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Ambiguous"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept valid define-use-drop", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["constant", 5]]],
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Destroyed");
  });

  it("must reject double-drop", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["constant", 5]]],
      ["drop", "%1"],
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept valid return of predefined variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Available"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(1);
    expect(result[1][0]).toEqual("Available");
  });

  it("must reject return of ambiguous variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Ambiguous"],
    );
    expect(result[0]).toEqual("error");
  });
});

describe("returning with borrowed resources", () => {
  it("must reject a borrow to Undefined resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept borrow to Available resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Available", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
  });

  it("must reject borrow to Destroyed resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Destroyed", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject borrow to Ambiguous resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Ambiguous", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept borrow to resource defined in block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
  });

  it("must reject borrow to a not-yet defined resource in the block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%0", ["unary", ["constant", 42]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });
});

describe("loading from borrowed resources", () => {
  it("must reject load of borrow to Undefined resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept load of borrow to Available resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Available", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Available");
  });

  it("must reject load of borrow to Destroyed resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Destroyed", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject load of borrow to Ambiguous resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Ambiguous", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept load of borrow to resource defined in the block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Available");
  });

  it("must reject load of borrow to a resource not-yet defined in the block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["let", "%0", ["unary", ["constant", 42]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject load of borrow to a resource already dropped in the block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%0"],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject load of a dropped borrow", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%1"],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Available", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });
});
