# Question
<!-- What am I figuring out? -->

How can a control flow graph be constructed from SSA code?

Date:   2026-05-05
Status: Doing

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [ ] copy HIR grammar into this lab
- [ ] copy several HIR examples from IR test-cases into these test-cases
- [ ] define CFG `Node = {name: Label, predecessors: number[], successors: number[]}`
- [ ] define `CFG = Node[]`
- [ ] ensure test-cases contain phi, a line of code, and all terminators (jump, branch, return)
- [ ] create a function to construct the CFG for a HIR.Function

... how do I check them for correctness? Do I do that by hand, or perhaps AI generate the expected results, before writing the code for CFG creation?

- [ ]

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
