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
