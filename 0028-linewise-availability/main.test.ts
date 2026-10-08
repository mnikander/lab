import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { linewise_availability } from "./main.ts";
import { Result } from "./lattice.ts";
import { Block } from "./grammar.ts";

const empty_block: Block = ["block", ["bindings"], ["lines"]];

describe("empty block", () => {
  it("must accept empty input", () => {
    const result: Result = linewise_availability([], [], empty_block);
    expect(result[0]).toEqual("ok");
  });

  it("must return availabilities unchanged", () => {
    const result: Result = linewise_availability(
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
    expect(() => linewise_availability([], [[0]], empty_block)).toThrow();
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
    const result: Result = linewise_availability(
      ["Undefined"],
      [[]],
      ["block", ["bindings"], ["lines", ["let", "%0", ["identity", [
        "constant",
        42,
      ]]], ["return", "%0"]]],
    );
    expect(result[0]).toEqual("ok");
  });

  it.skip("must reject return of 'Undefined' variable", () => {
    const result: Result = linewise_availability(
      ["Undefined"],
      [[]],
      ["block", ["bindings"], ["lines", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must reject return of 'Destroyed' variable", () => {
    const result: Result = linewise_availability(
      ["Destroyed"],
      [[]],
      ["block", ["bindings"], ["lines", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must reject return of 'Ambiguous' variable", () => {
    const result: Result = linewise_availability(
      ["Ambiguous"],
      [[]],
      ["block", ["bindings"], ["lines", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must accept valid define-use-drop", () => {
    const result: Result = linewise_availability(
      ["Undefined"],
      [[]],
      ["block", ["bindings"], [
        "lines",
        ["let", "%0", ["identity", ["constant", 42]]],
        ["let", "%1", ["identity", ["constant", 5]]],
        ["drop", "%1"],
        ["return", "%0"],
      ]],
    );
    expect(result[0]).toEqual("ok");
  });

  it.skip("must reject double-drop", () => {
    const result: Result = linewise_availability(
      ["Ambiguous"],
      [[]],
      ["block", ["bindings"], [
        "lines",
        ["let", "%0", ["identity", ["constant", 42]]],
        ["let", "%1", ["identity", ["constant", 5]]],
        ["drop", "%1"],
        ["drop", "%1"],
        ["return", "%0"],
      ]],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept valid return of predefined variable", () => {
    const result: Result = linewise_availability(
      ["Available"],
      [[]],
      ["block", ["bindings"], ["lines", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("ok");
  });

  it.skip("must reject return of ambiguous variable", () => {
    const result: Result = linewise_availability(
      ["Ambiguous"],
      [[]],
      ["block", ["bindings"], ["lines", ["return", "%0"]]],
    );
    expect(result[0]).toEqual("error");
  });
});
