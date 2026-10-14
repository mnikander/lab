import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { is_ok, Result } from "./result.ts";
import { Block } from "./grammar.ts";
import { BlockOperations, extract_transfers } from "./extract_transfer.ts";
import { is_failure } from "./result.ts";

const empty_block: Block = ["block", ["bindings"], ["instructions"]];

describe("extraction of variable-transfer tables", () => {
  it("must accept empty input", () => {
    const result: Result<BlockOperations> = extract_transfers(
      empty_block,
      0,
    );
    expect(is_ok(result)).toBe(true);
    expect(result[1].length).toEqual(0);
  });

  it("must throw when there are more variables than the specified variable count", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["jump", ["target", "^1", ["arguments"]]],
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
      ["jump", ["target", "^1", ["arguments"]]],
    ]];
    const result: Result<BlockOperations> = extract_transfers(
      code,
      1,
    );
    expect(is_ok(result)).toBe(true);
    expect(result[1].length).toEqual(1);
    expect(result[1][0]).toEqual([true, false]);
  });

  it("must extract define and drop of a variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["drop", "%0"],
      ["jump", ["target", "^1", ["arguments"]]],
    ]];
    const result: Result<BlockOperations> = extract_transfers(
      code,
      1,
    );
    expect(is_ok(result)).toBe(true);
    expect(result[1].length).toEqual(1);
    expect(result[1][0]).toEqual([true, true]);
  });

  it("must reject drop-before-define of a variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["drop", "%0"],
      ["let", "%0", ["unary", ["constant", 42]]],
      ["jump", ["target", "^1", ["arguments"]]],
    ]];
    const result: Result<BlockOperations> = extract_transfers(
      code,
      1,
    );
    expect(is_failure(result)).toBe(true);
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
      ["jump", ["target", "^1", ["arguments"]]],
    ]];
    const result: Result<BlockOperations> = extract_transfers(
      code,
      4,
    );
    expect(is_ok(result)).toBe(true);
    expect(result[1].length).toEqual(4);
    expect(result[1][0]).toEqual([false, false]);
    expect(result[1][1]).toEqual([false, true]);
    expect(result[1][2]).toEqual([true, false]);
    expect(result[1][3]).toEqual([true, true]);
  });

  it("must extract move of arguments to unary instruction", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["move", "%0"]]],
      ["jump", ["target", "^1", ["arguments"]]],
    ]];
    const result: Result<BlockOperations> = extract_transfers(
      code,
      2,
    );
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual([true, true]);
    expect(result[1][1]).toEqual([true, false]);
  });

  it("must extract move of arguments to binary instruction", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      ["let", "%1", ["unary", ["constant", 1]]],
      ["let", "%2", ["binary", ["peek", "%0"], ["move", "%1"]]],
      ["jump", ["target", "^1", ["arguments"]]],
    ]];
    const result: Result<BlockOperations> = extract_transfers(
      code,
      3,
    );
    expect(is_ok(result)).toBe(true);
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual([true, false]);
    expect(result[1][1]).toEqual([true, true]);
    expect(result[1][2]).toEqual([true, false]);
  });
});
