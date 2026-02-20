# Question
<!-- What am I figuring out? -->

How can an iterative fixed-point solver compute the availabilty of SSA variables?

Date: 2026-02-20

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- create a block type as a set or list of defines
- create a set/map type for block in-sets and out-sets
- create a directed edge type, which links blocks together
- implement a function which maps from the in-set and body of a block, to its out-set
- implement an iterative fixed-point solver which propagates availability through the CFG

## Running the Code
<!-- What steps are required to run the code? -->

```
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined a type for a CFG node, which contains the block name, set of defined variables, and the names of predecessor and successor blocks for easy navigation
- implemented a function `traverse` which updates the block's availabity
- simplified the `traverse` function to project the block and its in-set to its out-set

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
