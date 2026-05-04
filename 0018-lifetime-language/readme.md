# Question
<!-- What am I figuring out? -->

Can variable lifetimes be verified with a domain specific language (DSL)?

Date:   2026-05-03
Status: Doing

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [x] decide on a tiny define-use-free grammar scope
- [ ] write ownership grammar examples on paper or in markdown
- [x] ~~prototype define-use-free grammar in langium~~
- [x] prototype define-use-free grammar in Typescript, based on my High Intermediate Represenation (HIR)
- [x] define lattice on `{Undefined, Live, Dead}` or `{Pre, Live, Post}`
- [ ] write code examples in the lifetime grammar
- [x] find the set of all variables in a function
- [x] define a map from variable to state
- [x] initialize every variable's state with `["ok", "pre"]`
- [ ] propagate map of states through a linear block of instructions, updating at each instruction
- [ ] search the map for any variables in an error state

### Lowering and what we _really_ need

Instructions which use variables and define a new variable, can be lowered into a set of instructions, i.e. `x = add a b` -> (`use a`, `use b`, `define x`).
Phi nodes can be elimated in advance, by splitting edges.
Moves, i.e. `consume x` can be eliminated in advance, by replacing it with a (`copy x`,`free x`)
Jump can be eliminated by having one general `branch` instruction which takes 1..n successors.
A HIR `branch condition left right` can be lowered to (`use condition`, `branch [left, right]`)

The memory operations, such as `borrow`, `own`, `load`, `copy` of pointers, as well as `phi` will not be modelled here.
It is hoped that they can be eliminated during lowering.

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- outlined essentials and potential lowering story
- built small lifetime grammar based on HIR
- renamed `drop` to `free` to better conform with the usual error names such as 'use after free'
- defined lattice with bottom, pre, live, post, top
- defined transition functions
- wrote a few test-cases
- refactored transition functions to be a combination of the result and state monad
- used an agent to enumerate all 3-instruction test-cases
- coded the expected result into each test-case
- used an agent to generate the function calls corresponding to each test-case
- extract all variables from a program and create a map

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- Improve the variable extraction: write a pass over a Function which iterates over the blocks and lines of code (for-loop or for-each). It keeps an array of variable names and a set of seen variable names. For each instruction, check if the variable is unseen, if so, append it to the array and add it to the set. This returns an array of variable names without duplicates. This array provides a mapping from index to variable names. This in turn allows holding the state information for each variable as an array of states. That makes it much faster, cleaner, and easier to compare in-sets and out-sets for element-wise equality as well as doing join operations. This simplifies `[Register, Result]` to `Result[]`.
- Implement the `join` function to combine information from separate branches.
- Implement a queue-based worklist algorithm to do analysis over branching code. Do it on a per-function basis.
- Create a CFG (array of CFG nodes) which contains the block name (Label), as well as the predecessor indices and successor indices. The CFG array should be aligned with the block array, so the indices line up. This provides O(1) access to blocks and the CFG. Similarly an array of In-Sets can be held for each block, an array of out-sets, and an array of flags for whether or not the CFG node is already enqueued in the work list.

---
**Copyright (c) 2026 Marco Nikander**
