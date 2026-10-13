// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";
import { VariableState } from "./lattice.ts";
import { Block, ResourceId, to_index } from "./grammar.ts";
import { is_ok, Result } from "./result.ts";
import * as DSL from "./dsl_grammar.ts";
import { update } from "./dsl_evaluator.ts";
import { translate } from "./dsl_translate.ts";

export function linewise_availability(
  code: Block,
  points_to_set: ResourceId[][],
  state: VariableState[],
): Result<VariableState[]> {
  assert(
    state.length === points_to_set.length,
    `Pre-condition: the number of variable states and points-to sets must be equal. ${state.length} != ${points_to_set.length}`,
  );
  const [, tagged_bindings, tagged_instructions] = code;
  const [, ...bindings] = tagged_bindings;
  const [, ...lines] = tagged_instructions;

  bindings.forEach((b) => (state[to_index(b)] = "Available"));

  for (const l of lines) {
    const ops: DSL.Op[] = translate(l, points_to_set, state);
    const result: Result<VariableState[]> = update(
      state,
      ops,
    );
    if (is_ok(result)) {
      state = result[1];
    } else {
      return result; // error detected
    }
  }

  assert(
    state.length === points_to_set.length,
    `Post-condition: the number of variable states and points-to sets must be equal. ${state.length} != ${points_to_set.length}`,
  );

  return ["ok", state];
}
