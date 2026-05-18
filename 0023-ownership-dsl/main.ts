// Copyright (c) 2026 Marco Nikander

import { make_cfg } from "./control-flow-graph.ts";
import * as G from "./grammar.ts";
import { iterate_to_fixed_point } from "./worklist.ts";
import { Node } from "./graph.ts";
import { equal, is_element, join, make_updater, State } from "./lattice.ts";

export function check_function(func: G.Function): State[] {
  const graph: Node[] = make_cfg(func);
  const default_state: State = initial_state(func);
  const initial_out_states: State[] = Array(graph.length).fill(
    initial_state(func),
  );
  const update = make_updater(func);

  const out: State[] = iterate_to_fixed_point<State>(
    graph,
    default_state,
    initial_out_states,
    equal,
    join,
    update,
  );

  return out;
}

export function all_good(states: State[]): boolean {
  return states.every((s) => s.every((e) => is_element(e)));
}

// parameters are initialized as "defined" and alloca slots are initialized as "bottom"
function initial_state(func: G.Function): State {
  const parameter_count = func[2].length;
  const alloca_count = func[3].length;
  const register_count: number = parameter_count + alloca_count;
  const raw: State = Array(register_count).fill([
    "error",
    "Bug: unitialized state",
  ]);
  const parameters_defaulted: State = raw.map((_s, i) => {
    return (i < parameter_count) ? ["defined"] : ["bottom"];
  });
  return parameters_defaulted;
}
