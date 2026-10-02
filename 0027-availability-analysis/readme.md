# Question
<!-- What am I figuring out? -->

How can an availability analysis be implemented?
How can block-wise transfer functions be expressed in a simple way?

Date:   2026-10-02
Status: Todo

## Hypothesis
<!-- What do I think is going to happen? -->

The hypothesis is that the analysis can be broken down into a high-level dataflow analysis and a separate line-by-line analysis of each block.
First, a simple transfer function is be computed for each block.
Second, the dataflow analysis on the control flow graph is done using only the transfer function, not the code in the blocks.
Finally, the line-by-line processing of each block is done using the computed program states at each block entry.

This lab will focus on the 2nd step.

## Resources
<!-- Where can I find relevant information? -->

- Static Program Analysis, Moller et al. (especially the "propagation worklist algorithm" on pp 76)

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Steps
<!-- What did I do? -->

- [ ] define a Graph type
- [ ] define a Lattice type for the program state
- [ ] define a Lattice type for the resource state
- [ ] define an encoding for the transfer function
- [ ] implement join operation for program states
- [ ] implement the propagation worklist algorithm
- [ ] select several interesting cases from the MIR test-cases (control flow loops, diamonds, splits, etc)
- [ ] hand code the control flow graphs and transfer functions

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
