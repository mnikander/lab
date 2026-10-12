// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert/assert";
import { Op } from "./dsl_grammar.ts";
import { translate } from "./dsl_translate.ts";
import * as IR from "./grammar.ts";
import { VariableState } from "./lattice.ts";

export type BlockOperations = [defined: boolean, dropped: boolean][];

export function extract_transfers(
  block: IR.Block,
  variable_count: number,
): BlockOperations {
  const instructions: IR.Instructions = block[2];
  const [, ...lines] = instructions;

  // initialize results array, ensuring that each array entry is it's own javascript object
  const result: BlockOperations = [...Array(variable_count)].map(
    () => [false, false],
  );

  // construct an empty points-to set and state, since we don't need them for this extraction
  const points_to_set: IR.ResourceId[][] = [...Array(variable_count)].map(
    () => [],
  );
  const state: VariableState[] = [...Array(variable_count)].map(
    () => "Undefined",
  );

  for (const l of lines) {
    const ops: Op[] = translate(l, points_to_set, state); // re-use translate() from the line-by-line analysis
    for (const o of ops) {
      const id: IR.ResourceId = o[1];
      const index: number = IR.to_index(id);
      assert(
        result[index] !== undefined,
        `Expected variable index '${index}' to be in range: 0 to ${
          variable_count - 1
        } inclusive`,
      );
      if (o[0] === "define") {
        result[index][0] = true;
      } else if (o[0] === "drop") {
        result[index][1] = true;
      }
    }
  }

  return result;
}
