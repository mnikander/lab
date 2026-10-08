import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { linewise_availability } from "./main.ts";
import { Result } from "./lattice.ts";
import { Block } from "./grammar.ts";

const empty_block: Block = ["block", ["bindings"], ["lines"]];

describe("empty block", () => {
  it("must pass on empty input", () => {
    const result: Result = linewise_availability([], [], empty_block);
    expect(result[0]).toEqual("ok");
  });

  it("must return availabilities unchanged", () => {
    const result: Result = linewise_availability(
      ["Undefined", "Available", "Destroyed", "Ambiguous"], [[], [], [], []], empty_block);
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
    expect(() => linewise_availability(["Available"], [], empty_block)).toThrow();
  });

  it("must throw on unequal lengths", () => {
    expect(() => linewise_availability(["Available"], [[],[]], empty_block)).toThrow();
  });
});
