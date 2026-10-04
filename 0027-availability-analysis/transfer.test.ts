// Copyright (c) 2026 Marco Nikander

import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { block_transition } from "./transfer.ts";
import { BlockState, VariableState } from "./lattices.ts";

describe("block_transition", () => {
  it("bottom -> known", () => {
    const initial: BlockState = ["Bottom"];
    const expected: BlockState = ["Known", [
      "Undefined",
      "Ambiguous",
      "Available",
      "Destroyed",
    ]];
    const transitions: [boolean, boolean][] = [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ];
    expect(block_transition(initial, transitions)).toEqual(expected);
  });

  it("known -> known", () => {
    const initial: BlockState = ["Known", [
      "Ambiguous",
      "Ambiguous",
      "Ambiguous",
      "Ambiguous",
      "Destroyed",
      "Destroyed",
      "Destroyed",
      "Destroyed",
      "Available",
      "Available",
      "Available",
      "Available",
      "Undefined",
      "Undefined",
      "Undefined",
      "Undefined",
    ]];
    const transitions: [boolean, boolean][] = [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
      [false, false],
      [false, true],
      [true, false],
      [true, true],
      [false, false],
      [false, true],
      [true, false],
      [true, true],
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ];
    const expected: BlockState = ["Known",[
      "Ambiguous",
      "Ambiguous",
      "Available",
      "Destroyed",
      "Destroyed",
      "Ambiguous",
      "Available",
      "Destroyed",
      "Available",
      "Destroyed",
      "Available",
      "Destroyed",
      "Undefined",
      "Ambiguous",
      "Available",
      "Destroyed",
    ]];
    expect(block_transition(initial, transitions)).toEqual(expected);
  });
});
