# Question
<!-- What am I figuring out? -->

How can a control flow graph be constructed from SSA code?

Date:   2026-05-05
Status: Done

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [x] copy HIR grammar into this lab
- [x] copy several HIR examples from IR test-cases into these test-cases
- [x] define CFG `Node = {name: Label, predecessors: number[], successors: number[]}`
- [x] define `CFG = Node[]`
- [x] ensure test-cases contain phi, a line of code, and all terminators (jump, branch, return)
- [x] define expected values for test-cases
- [x] create a function to construct the CFG for a HIR.Function

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- copied HIR grammar 
- removed type annotations from HIR since they aren't relevant here (needs fewer files/includes then)
- selected two unit tests from HIR which are simple but contain a lot of control flow within one function
- defined Node and CFG datatype
- stubbed the `make_cfg` function
- used an agent to generate the expected values for the test-cases
- hand-check the expected values
- started implementing `make_cfg`
- implemented a `block_successors` function which returned a partially filled in CFG; this was a bad idea because the predecessors were empty and the function mixed concerns
- implemented `extract_block_names` and `label_to_index` which were straight-forward
- implemented a `block_successors` function which just returns an array of arrays of indices, so it returns exactly what it computes -- this separates concerns cleanly
- implemented predecessor computation
- zipped the labels, predecessors, and successors to complete the implementation of `make_cfg`
- run tests to verify my implementation against the expected values from the LLM

## Findings
<!-- What did I learn? -->

- generating test-cases was helpful
- it was a really good idea to do this in isolation as a lab, it was a little tricky to make the code nice
- for-loops were easier than their functional equivalents in some places
- an index-based map is an awesome way to zip, super easy to use
- predecessors were a little tricky to compute
- returning partially computed CFG nodes was messy, since it threw away type-safety, it was much cleaner and easier to do calculations which returned the indices, and then zip everything together

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- can the predecessor computation be expressed in a simpler way?
- could algorithms such as `gather` and `scatter` (similar to APL or Nvidia Thrust) be used here?

---
**Copyright (c) 2026 Marco Nikander**
