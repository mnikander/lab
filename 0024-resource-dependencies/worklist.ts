// Copyright (c) 2026 Marco Nikander

import { Node } from "./graph.ts";

export function iterate_to_fixed_point<Element, State>(
  graph: Node[],
  elements: Element[],
  entry_in_state: State,
  out_states: State[],
  equal: (left: State, right: State) => boolean,
  join: (left: State, right: State) => State, // must return a COPY to avoid in-place mutation of left/right
  update: (in_state: State, element: Element) => State,
): State[] {
  const worklist: Worklist = initialize_worklist(graph.length);
  while (!is_empty(worklist)) {
    const current: number = try_pop(worklist) as number;
    const node: Node = graph[current];
    const element: Element = elements[current];
    const in_state: State = (node.pred.length === 0)
      ? entry_in_state
      : node.pred.map((n) => out_states[n]).reduce((
        left,
        right,
      ) => join(left, right));
    const updated_out_state = update(in_state, element);
    if (!equal(out_states[current], updated_out_state)) {
      out_states[current] = updated_out_state;
      node.succ.forEach((s) => {
        try_push(s, worklist);
      });
    }
  }
  return out_states;
}

type Worklist = { queue: number[]; contains: boolean[] };

function initialize_worklist(count: number): Worklist {
  return { queue: [...Array(count).keys()], contains: Array(count).fill(true) };
}

function is_empty(worklist: Worklist): boolean {
  return worklist.queue.length === 0;
}

// in-place update
function try_push(node_index: number, worklist: Worklist) {
  if (worklist.contains[node_index] === false) {
    worklist.contains[node_index] = true;
    worklist.queue.push(node_index);
  }
}

// in-place update
function try_pop(worklist: Worklist): undefined | number {
  const value: undefined | number = worklist.queue.shift();
  if (value !== undefined) {
    worklist.contains[value] = false;
  }
  return value;
}
