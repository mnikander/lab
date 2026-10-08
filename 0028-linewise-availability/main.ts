// Copyright (c) 2026 Marco Nikander

import { assert } from "@std/assert";
import { Result, VariableState } from "./lattice.ts";
import { Block } from "./grammar.ts";

export function linewise_availability(initial: VariableState[], points_to_set: number[][], code: Block): Result {
    assert(initial.length === points_to_set.length, `The number of variable states and points-to sets must be equal. ${initial.length} != ${points_to_set.length}`);
    return ["ok", initial];
}
