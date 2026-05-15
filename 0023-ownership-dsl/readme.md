# Question
<!-- What am I figuring out? -->

Can ownership be modelled within functions and across function boundaries with a small DSL?

Date:   2026-05-15
Status: Doing

## Resources
<!-- Where can I find relevant information? -->

- [lab 0020 dataflow](../0020-dataflow/)
- Static Program Analysis, Moeller et al
- MDN [web assembly syntax](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Understanding_the_text_format)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [x] define the DSL grammar via types, but in symbolic expression style
- [x] write several example programs in unit tests
- [x] copy, adapt, and test the datatype and function to compute CFGs
- [ ] refactor the syntax / grammar until it is _not_ painful to write DSL programs
- [ ] write down `return` semantics for different kinds of values
- [ ] write down function argument and function return value semantics regarding life-time and ownership
- [ ] define a datatype to hold meta-data about a variable
- [ ] define lattice type, update functions, and join
- [ ] decide whether to fail on the first error, or to return a list of (success | error) entries for every DSL line
- [ ] define / look up an API for a worklist algorithm
- [ ] implement the worklist algorithm as a stand-alone component to separate concerns
- [ ] implement dataflow analysis on the DSL
- [ ] extend the test-cases: find cases where it breaks! 
- [ ] can aggregates, pointers, resource handles, closures, phi nodes, moving phi nodes, and in-place updates all be lowered into this DSL?

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined the grammar, initially with string identifiers for labels and registers
- simplified the grammar by removing string identifiers and just using indices and the implicit position
- wrote a stub `check(program)` function which always returns true
- wrote several test-cases by hand, by porting test-cases from lab-0020
- used an LLM to port several additional test-cases from lab-0020
- noticed that I forgot several alloca instructions in my hand-written test-cases, because I didn't have them in the previous grammar
- wrote a test-case for a missing alloca instruction
- fixed and activated tests cases (7 steps pass, 6 steps fail)

## Findings
<!-- What did I learn? -->

- The new symbolic-expression syntax always starts with a tag. This is inspired by the sybolic expression syntax in WASM. I think it is simple, compact, and easy to read. I think the tags give a lot more information about what is what, which massively decreases the cognitive load of reading the code. I _really_ like this new syntax!

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
