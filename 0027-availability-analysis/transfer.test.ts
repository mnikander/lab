// Copyright (c) 2026 Marco Nikander

import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { block_transfer } from "./transfer.ts";
import { BlockState } from "./lattices.ts";

describe("block_transfer", () => {
  it("bottom -> known", () => {
    const initial: BlockState = ["Bottom"];
    const expected: BlockState = ["Known", [
      "Undefined",
      "Ambiguous",
      "Available",
      "Destroyed",
    ]];
    const transfers: [boolean, boolean][] = [
      [false, false],
      [false, true],
      [true, false],
      [true, true],
    ];
    expect(block_transfer(initial, transfers)).toEqual(expected);
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
    const transfers: [boolean, boolean][] = [
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
    const expected: BlockState = ["Known", [
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
    expect(block_transfer(initial, transfers)).toEqual(expected);
  });
});
