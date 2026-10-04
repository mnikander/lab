# Question

<!-- What am I figuring out? -->

How can an availability analysis be implemented? How can block-wise transfer
functions be expressed in a simple way?

Date: 2026-10-02

Status: Todo

## Hypothesis

<!-- What do I think is going to happen? -->

The hypothesis is that the analysis can be broken down into a high-level
dataflow analysis and a separate line-by-line analysis of each block. First, a
simple transfer function is be computed for each block. Second, the dataflow
analysis on the control flow graph is done using only the transfer function, not
the code in the blocks. Finally, the line-by-line processing of each block is
done using the computed program states at each block entry.

This lab will focus on the 2nd step, and will leave out any details about the
code itself. This also avoids having to define a grammar for the IR, and avoids
questions about phi nodes vs. parameterized blocks. Ideally, this analysis is
compact and simple. The manual or LLM-assisted creation of test-cases may be a
bit tedious. It is well worth the effort to find out whether or not this
approach works. This approach has the potential to simplify the analysis
code-base significantly.

## Resources

<!-- Where can I find relevant information? -->

- Static Program Analysis, Moller et al. (especially the "propagation worklist
  algorithm" on pp 76)

## Running the Code

<!-- What steps are required to run the code? -->

```bash
deno test
```

## Steps

<!-- What did I do? -->

- [x] define a Graph type
- [x] define a Lattice type for the program state
- [x] define a Lattice type for the resource state
- [x] implement join operation for program states
- [x] define an encoding for the transfer function
- [x] test the `block_transfer` function
- [ ] implement the propagation worklist algorithm
- [ ] select several interesting cases from the MIR test-cases (control flow
      loops, diamonds, splits, etc)
- [ ] hand code the control flow graphs for the examples
- [ ] hand code the transfer functions for the examples

### Transfer Function

To implement the `block_transfer` function, a few things are needed.
- `variable_transfer` function
- `block_transfer` which takes the block state, and maps each variable state in the vector to its new variable state, to produce the updated block state

The `variable_transfer` function could be implemented as a closure: `(is_defined, is_dropped) => ((variable_state) => variable_state)`.
I can then create a vector of such closures, one for each variable in the IR function.

Alternatively, the block transfer function can take an array of a `[boolean, boolean]` pair.
This array has one entry for each variable, which encodes if the variable is defined and/or dropped in that block.
The `block_transfer` function applies a map over its variable states, by applying the variable transfer function with those booleans.
This is the block transfer function, for one block.
I need to store one such array of boolean-pairs, for each block.
The worklist algorithm over the CFG graph uses this array to update the block states.

### Block join function

The worklist algorithm must join two block states, whenever there are multiple incoming CFG edges into a block.
Perhaps the predecessors are useful here, or perhaps they are not needed because the new state and old state can always be joined, for each incoming edge individually.

### Propagation Work List algorithm (Moller et al.)
```
procedure PropagationWorkListAlgorithm(t1 , ... , tn )
  (x_1 , ... , x_n) := (⊥, ... , ⊥)
  W := {v_1 , ... , v_n}
  while W != ∅ do
    v_i := W.removeNext()
    y := t_v_i (x_i)
    for each v_j ∈ dep(v_i) do
      z := x_j ⊔ y
      if x_j != z then
        x_j := z
        W.add(v_j)
      end if
    end for
  end while
  return (x_1 , ... , x_n)
end procedure
```
where:
- `x_i` is the BlockState at control-flow graph node V_i
- `y` is the state at the end of the block, i.e. after applying the transfer function
- `z` is `join(x_s, y)` for each successor block 's'

## Findings

<!-- What did I learn? -->
- Learning about JavaScript/TypeScript: Range-based for-loops, i.e. `for (let id of worklist)`, operate on the container correctly even if push_back is called during the iteration
- A `return` instruction cannot be modelled as a regular drop. A 'return' instruction drops everything which has not yet been dropped. It must not cause a double-drop error though for variables which were dropped explicitly sometime before the return statement.

## Future Work

<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

---

**Copyright (c) 2026 Marco Nikander**
