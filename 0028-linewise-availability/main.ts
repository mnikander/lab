// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";
import { Result, VariableState } from "./lattice.ts";
import { Block, Drop, Let, Terminator } from "./grammar.ts";

export function linewise_availability(
  initial: VariableState[],
  points_to_set: number[][],
  code: Block,
): Result {
  assert(
    initial.length === points_to_set.length,
    `The number of variable states and points-to sets must be equal. ${initial.length} != ${points_to_set.length}`,
  );
  const lines: (Let | Drop | Terminator | "lines" | undefined)[] = [
    ,
    ...code[2],
  ];
  return ["ok", initial];
}
