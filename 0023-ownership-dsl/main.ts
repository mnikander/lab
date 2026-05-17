// Copyright (c) 2026 Marco Nikander

import { make_cfg } from "./control-flow-graph.ts";
import * as G from "./grammar.ts";
import { iterate_to_fixed_point } from "./worklist.ts";
import { Node } from "./graph.ts";
import { equal, is_element, join, make_updater, State } from "./lattice.ts";

export function check_function(func: G.Function): boolean {
  const graph: Node[] = make_cfg(func);
  const register_count: number = func[2].length + func[3].length;
  const default_state: State = Array(register_count).fill(["bottom"]);
  const initial_out_states: State[] = Array(graph.length).fill(
    Array(register_count).fill(["bottom"]),
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

  return out.every((s) => s.every((e) => is_element(e)));
}
