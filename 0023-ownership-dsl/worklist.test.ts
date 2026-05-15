import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { Node } from "./graph.ts";
import { iterate_to_fixed_point } from "./worklist.ts";

describe("programs with one function", () => {
  // This lattice and update function is a bit contrived, but it should allow a
  // loop test to actually do an iteration. It models something like:
  // "this node can be reached by a path of length > 0 from the entry"

  type Top = readonly ["top"];
  type Bottom = readonly ["bottom"];
  type State = Top | Bottom;

  function equal(left: State, right: State): boolean {
    return left[0] === right[0];
  }

  function join(left: State, right: State): State {
    // ensure that a fresh copy is created
    if (equal(left, right)) {
      return left[0] === "bottom" ? ["bottom"] : ["top"];
    } else {
      return ["top"];
    }
  }

  function update(index: number, in_state: State): State {
    if (in_state[0] === "bottom") {
      return index > 0 ? ["top"] : ["bottom"];
    } else {
      return in_state;
    }
  }

  it("must converge for a single node", () => {
    const graph: Node[] = [{ pred: [], succ: [] }];
    const initial_out_states: State[] = [["bottom"]];
    const out_states = iterate_to_fixed_point(
      graph,
      ["bottom"],
      initial_out_states,
      equal,
      join,
      update,
    );
    expect(out_states[0]).toEqual(["bottom"]);
  });

  it("must converge for three sequential nodes", () => {
    const graph: Node[] = [
      { pred: [], succ: [1] },
      { pred: [0], succ: [2] },
      { pred: [1], succ: [] },
    ];
    const initial_out_states: State[] = [["bottom"], ["bottom"], ["bottom"]];
    const out_states = iterate_to_fixed_point(
      graph,
      ["bottom"],
      initial_out_states,
      equal,
      join,
      update,
    );
    expect(out_states[0]).toEqual(["bottom"]);
    expect(out_states[1]).toEqual(["top"]);
    expect(out_states[2]).toEqual(["top"]);
  });

  it("must converge for four nodes which form a diamond", () => {
    const graph: Node[] = [
      { pred: [], succ: [1, 2] },
      { pred: [0], succ: [3] },
      { pred: [0], succ: [3] },
      { pred: [1, 2], succ: [] },
    ];
    const initial_out_states: State[] = [
      ["bottom"],
      ["bottom"],
      ["bottom"],
      ["bottom"],
    ];
    const out_states = iterate_to_fixed_point(
      graph,
      ["bottom"],
      initial_out_states,
      equal,
      join,
      update,
    );
    expect(out_states[0]).toEqual(["bottom"]);
    expect(out_states[1]).toEqual(["top"]);
    expect(out_states[2]).toEqual(["top"]);
    expect(out_states[3]).toEqual(["top"]);
  });

  it("must converge for three nodes which split into separate paths", () => {
    const graph: Node[] = [
      { pred: [], succ: [1, 2] },
      { pred: [0], succ: [] },
      { pred: [0], succ: [] },
    ];
    const initial_out_states: State[] = [["bottom"], ["bottom"], ["bottom"]];
    const out_states = iterate_to_fixed_point(
      graph,
      ["bottom"],
      initial_out_states,
      equal,
      join,
      update,
    );
    expect(out_states[0]).toEqual(["bottom"]);
    expect(out_states[1]).toEqual(["top"]);
    expect(out_states[2]).toEqual(["top"]);
  });

  it("must converge for a loop", () => {
    const graph: Node[] = [
      { pred: [1], succ: [1] },
      { pred: [0], succ: [0] },
    ];
    const initial_out_states: State[] = [["bottom"], ["bottom"]];
    const out_states = iterate_to_fixed_point(
      graph,
      ["bottom"],
      initial_out_states,
      equal,
      join,
      update,
    );
    expect(out_states[0]).toEqual(["top"]);
    expect(out_states[1]).toEqual(["top"]);
  });
});
