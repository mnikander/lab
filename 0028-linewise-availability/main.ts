// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";
import { VariableState } from "./lattice.ts";
import { Block, Instructions, Line, ResourceId } from "./grammar.ts";
import { Result } from "./result.ts";

export function linewise_availability(
  initial: VariableState[],
  points_to_set: ResourceId[][],
  code: Block,
): Result<VariableState[]> {
  assert(
    initial.length === points_to_set.length,
    `The number of variable states and points-to sets must be equal. ${initial.length} != ${points_to_set.length}`,
  );
  const instructions: Instructions = code[2];
  const lines: Line[] = [, ...instructions] as Line[];

  return ["ok", initial];
}
