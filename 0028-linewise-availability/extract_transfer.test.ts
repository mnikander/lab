import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { linewise_availability } from "./main.ts";
import { Result } from "./result.ts";
import { Block } from "./grammar.ts";
import { VariableState } from "./lattice.ts";
import { BlockOperations, extract_transfers } from "./extract_transfer.ts";

const empty_block: Block = ["block", ["bindings"], ["instructions"]];

describe("extraction of variable-transfer tables", () => {
  it("must accept empty input", () => {
    const result: BlockOperations = extract_transfers(
      empty_block,
      0,
    );
    expect(result.length).toEqual(0);
  });

  it("must throw when there are more variables than the specified variable count", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["jump", "^1"],
    ]];
    expect(() =>
      extract_transfers(
        code,
        0,
      )
    ).toThrow();
  });

  it("must extract define of a variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["jump", "^1"],
    ]];
    const result: BlockOperations = extract_transfers(
      code,
      1,
    );
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual([true, false]);
  });

  it("must extract define and drop of a variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["drop", "%0"],
      ["jump", "^1"],
    ]];
    const result: BlockOperations = extract_transfers(
      code,
      1,
    );
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual([true, true]);
  });

  // this could also be changed, this test-case is really just noting this deficiency of the approach
  it("may extract define and drop of a variable in any order", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["drop", "%0"],
      ["let", "%0", ["unary", ["constant", 42]]],
      ["jump", "^1"],
    ]];
    const result: BlockOperations = extract_transfers(
      code,
      1,
    );
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual([true, true]);
  });

  it("must extract define and drop of multiple variables", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      // %0 is neither defined nor dropped in this block
      // %1 is not defined, but is dropped in this block
      ["drop", "%1"],
      ["let", "%2", ["unary", ["constant", 2]]],
      ["let", "%3", ["unary", ["constant", 3]]],
      ["drop", "%3"],
      ["jump", "^1"],
    ]];
    const result: BlockOperations = extract_transfers(
      code,
      4,
    );
    expect(result.length).toEqual(4);
    expect(result[0]).toEqual([false, false]);
    expect(result[1]).toEqual([false, true]);
    expect(result[2]).toEqual([true, false]);
    expect(result[3]).toEqual([true, true]);
  });

  it("must extract move of arguments to unary instruction", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["move", "%0"]]],
      ["jump", "^1"],
    ]];
    const result: BlockOperations = extract_transfers(
      code,
      2,
    );
    expect(result.length).toEqual(2);
    expect(result[0]).toEqual([true, true]);
    expect(result[1]).toEqual([true, false]);
  });

  it("must extract move of arguments to binary instruction", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      ["let", "%1", ["unary", ["constant", 1]]],
      ["let", "%2", ["binary", ["peek", "%0"], ["move", "%1"]]],
      ["jump", "^1"],
    ]];
    const result: BlockOperations = extract_transfers(
      code,
      3,
    );
    expect(result.length).toEqual(3);
    expect(result[0]).toEqual([true, false]);
    expect(result[1]).toEqual([true, true]);
    expect(result[2]).toEqual([true, false]);
  });
});
