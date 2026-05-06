// Copyright (c) 2026 Marco Nikander

import { CFG } from "./control-flow-graph.ts";
import { Program } from "./grammar.ts";
import { Result } from "./lattice.ts";

export function dataflow(
  program: Program,
  graph: CFG,
  variables: number[],
): Result[] {
  // TODO
  return [];
}

export function find_errors(
  states: Result[],
): number[] {
  const zipped: [number, Result][] = states.map((s, i) => [i, s]);
  const filtered: [number, Result][] = zipped.filter((e) =>
    e[1][0] === "error"
  );
  const result: number[] = filtered.map((e) => e[0]);
  return result;
}
