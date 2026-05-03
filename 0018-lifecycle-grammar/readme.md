# Question
<!-- What am I figuring out? -->

Can variables be checked, for valid life-cycles, via a small specialized grammar?

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
- [ ] write code examples in the life-cycle grammar
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
- built small life-cycle grammar based on HIR
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



---
**Copyright (c) 2026 Marco Nikander**
