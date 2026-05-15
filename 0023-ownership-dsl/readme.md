# Question and Hypothesis
<!-- What am I figuring out? -->
<!-- What do I think is going to happen? -->

1. **Can ownership be modelled within functions and across function boundaries with a small DSL?**
- Probably to an extent
- I am unsure if constructs like pointers can really be lowered cleanly into the DSL
- I am also unsure if the _intra_-function and _inter_-function analysis can really be done well in a single run
- I will find tricky corner-cases which I have not considered before

2. **Can symbolic expressions be used to express the ownership DSL in a compact and readable form?**
- I'm skeptical, there will be a lot of parentheses and nesting
- WASM-like symbolic expressions have a tag in every expression, that may help readability

3. **Can separating concerns, by implementing a general iterative fixed-point solver as a standalone component, make the codebase simpler?**
- I think yes
- the generic implementation of the solver may be very difficult, because it needs a lot of functionality which is specific to the problem

Date:   2026-05-15
Status: Doing

## Resources
<!-- Where can I find relevant information? -->

- [lab 0020 dataflow](../0020-dataflow/)
- Static Program Analysis, Moeller et al
- MDN [web assembly syntax](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Understanding_the_text_format)

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Steps
<!-- What did I do? -->

- [x] define the DSL grammar via types, but in symbolic expression style, initially with string identifiers for labels and registers
- [x] simplified the grammar by removing string identifiers and just using indices and the implicit position
- [x] wrote a stub `check(program)` function which always returns true
- [x] write several example programs in unit tests by hand, by porting test-cases from lab-0020
- [x] used an LLM to port several additional test-cases from lab-0020
- [x] noticed that I forgot several alloca instructions in my hand-written test-cases, because I didn't have them in the previous grammar
- [x] wrote a test-case for a missing alloca instruction
- [x] fixed and activated tests cases (7 steps pass, 6 steps fail)
- [x] copy, adapt, and test the datatype and function to compute CFGs
- [x] factor the Graph into its own file so the CFG and Solver functions can both use it
- [ ] define / look up an API for a worklist algorithm
- [ ] decide whether to fail on the first error, or to return a list of (success | error) entries for every DSL line
- [ ] implement the worklist algorithm as a stand-alone component to separate concerns
- [ ] define a trivial two-element lattice (or boolean lattice, with four elements) which can be used on a CFG
- [ ] test the worklist algorithm on CFGs
- [ ] refactor the syntax / grammar until it is _not_ painful to write DSL programs
- [ ] write down `return` semantics for different kinds of values
- [ ] write down function argument and function return value semantics regarding life-time and ownership
- [ ] define a datatype to hold meta-data about a variable
- [ ] define lattice type, update functions, and join
- [ ] implement dataflow analysis on the DSL
- [ ] extend the test-cases: find cases where it breaks! 
- [ ] can aggregates, pointers, resource handles, closures, phi nodes, moving phi nodes, and in-place updates all be lowered into this DSL?

## Findings
<!-- What did I learn? -->

- The new symbolic-expression syntax always starts with a tag. This is inspired by the sybolic expression syntax in WASM. I think it is simple, compact, and easy to read. I think the tags give a lot more information about what is what, which massively decreases the cognitive load of reading the code. I _really_ like this new syntax!

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
