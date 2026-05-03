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

- [ ] decide on a tiny define-use-drop grammar scope
- [ ] write ownership grammar examples on paper or in markdown
- [ ] prototype define-use-drop grammar in langium
- [ ] prototype define-use-drop grammar in Typescript, based on my High Intermediate Represenation (HIR)
- [ ] define lattice on `{Undefined, Live, Dead}` or `{Pre, Live, Post}`
- [ ] find the set of all variables in a block (or function)
- [ ] define in-set/out-set
- [ ] propagate state through a linear block of instructions

### Lowering and what we _really_ need

Instructions which use variables and define a new variable, can be lowered into a set of instructions, i.e. `x = add a b` -> (`use a`, `use b`, `define x`).
Phi nodes can be elimated in advance, by splitting edges.
Moves, i.e. `consume x` can be eliminated in advance, by replacing it with a (`copy x`,`drop x`)
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



## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
