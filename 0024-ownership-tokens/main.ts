// Copyright (c) 2026 Marco Nikander

import * as G from "./grammar.ts";
import { Graph } from "./graph.ts";

export type DependencyGraph = Dependency[][];
export type Dependency = ["token", number] | ["target_of", Dependency];

// TODO: implement this
export function compute_dependencies(
  fun: G.Function,
  _cfg: Graph,
): DependencyGraph {
  const params: G.Parameter[] = G.get_params(fun);
  const allocas: G.Alloca[] = G.get_allocas(fun);
  const empty_deps_for_params: DependencyGraph = params.map((_e) => []);
  const empty_deps_for_allocas: DependencyGraph = allocas.map((_e) => []);
  return [...empty_deps_for_params, ...empty_deps_for_allocas];
}
