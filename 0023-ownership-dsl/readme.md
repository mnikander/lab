# Question and Hypothesis
<!-- What am I figuring out? -->

1. Can ownership be modelled within functions with a small DSL?
2. ~~Can ownership be modelled across function boundaries, with an extension of that DSL?~~ _(will be done in a separate lab)_
3. Can symbolic expressions be used to express the ownership DSL in a compact and readable form?
4. Can separating concerns, by implementing a general iterative fixed-point solver as a standalone component, make the codebase simpler?

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

## Hypothesis
<!-- What do I think is going to happen? -->

Many memory operations and constructs can probably be modelled with a simple DSL.
There may be corner-cases which are very difficult or impossible to model, however.
It's unclear if the _intra_-function and _inter_-function analysis can be done well in a single dataflow run.

Regarding the syntax, there will probably be a lot of parentheses and nesting.
WASM-like symbolic expressions have a tag in every expression, which may help readability.

The generic implementation of the iterative fixed point solver may help separate concerns, but could be very difficult to implement because it needs a lot of functionality which is specific to the problem.

## Semantics of `return`

The `return` statement plays a special role, since it moves a result variable out of the function and pops the entire stack frame.
The result variable _and all other variables_ must satisfy certain properties for this to be a valid operation.
Each variable state is in the set: `{ bottom, undefined, defined, dropped, top }`.
The following two tables outline these requirements, as well as cases which are always an error.

### Depending on the annotations of the return value, its State must be...

|                    | Affine   | Linear   |
| :--                | :--      | :--      |
| (Local , Basic  )  | defined  | defined  |
| (Local , Pointer)  | ERROR    | ERROR    |
| (Caller, Pointer)  | defined  | defined  |
| (Global, Pointer)  | defined  | defined  |

### Depending on their annotations, everyone else must be...

|                    | Affine   | Linear   |
| :--                | :--      | :--      |
| (Local , Basic  )  | anything | dropped  |
| (Local , Pointer)  | anything | dropped  |
| (Caller, Pointer)  | anything | dropped  |
| (Global, Pointer)  | anything | dropped  |

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
- [x] define / look up an API for a iterative solver
- [x] implement the iterative solver algorithm as a stand-alone component to separate concerns
- [x] define a trivial two-element lattice (or boolean lattice with four elements) which can be used on a CFG
- [x] test the iterative solver on CFGs
- [x] refactor the syntax / grammar until it is _not_ painful to write DSL programs and analyses
- [x] define a datatype to hold meta-data about a variable
- [x] define lattice type, update functions, and join
- [x] decide whether to fail on the first error, or to return a list of (success | error) entries for every DSL line
- [x] decided to remove the test cases for `alloca` from this lab and make them future work
- [x] re-implement dataflow analysis on the DSL, using the code from lab 0020 as a starting point
- [x] add semantic annotations to the function return type as well
- [x] decided to reduce the scope of the lab to keep things simple
- [x] decided to focus on a cleaner worklist algorithm and the grammar based on symbolic expressions
- [x] decided to include function `return` in this lab, which is an extension compared to lab-0020
- [x] decided to prototype the function call-site semantics in separate lab
- [x] decided not to model escape-semantics for function parameters in this lab (just assume they can escape)
- [x] simplified type annotation to distinguish only between "basic" and "pointer" since the rest is not relevant for this lab
- [x] decided to keep the Scope at {Local, Caller, Global} and not to differentiate between "Local" and "Pointer to Local" in the Scope -- you have to use the Type, i.e. { Basic, Pointer } information to make that distinction -- this separates concerns a bit
- [x] write down `return` semantics for different kinds of values
- [x] implement the dataflow analysis for `return`
- [x] investigate dataflow analysis with debugger
- [x] is the new implementation noticably slower than the original implementation in lab-0020? => not for these small test-cases
- [x] test-cases with functions which contain linear variables
- [x] decide to allow locals with linear semantics, since a resource handle or even heap storage may be desired in a local context
- [ ] test-cases with functions which take parameters
- [ ] test-case for a program which contains two individual functions

## Findings
<!-- What did I learn? -->

- The new symbolic-expression syntax always starts with a tag. This is inspired by the sybolic expression syntax in WASM. I think it is simple, compact, and easy to read. I think the tags give a lot more information about what is what, which massively decreases the cognitive load of reading the code. I _really_ like this new syntax!
- The generic iterative solver was pretty straight-forward to implement. The only real stumbling block was the computation of the `in_state` via reduce. That doesn't work for entry nodes with no incoming edges, so a in_state for the entry node is passed in explicitly. Note that reduce uses this value as it's accumulator, so you have to be really careful about avoiding in-place mutation. This is problematic because I don't know of any universal mechanism to do a deep-copy of any primitive or object value in JavaScript/TypeScript. This requires caution when implementing join.
- When writing the code, it's very easy to get confused between the out state of one  node, i.e. `LatticeElement[]` and the set of such out-states, i.e. `LatticeElement[][]`.
- It is easy to forget `alloca` slots when typing in the symbolic expressions for the code. Having an analysis pass to check that enough slots are allocated, and that all allocated slots are actually needed, is important for execution / evaluation. For analysis it leads to missing or excessive meta-data.
- In the lattice transition I _again_ forgot to set any "bottom" entries to "undefined" at the end of the block.
- Implementing the lattice and the transition function correctly was a challenge. Debugging the `make_updater` function is a bit more tricky than the plain function, but it's OK.
- The chosen interface for the iterative fixed-point solver works for this use case! :)
- I have a lot of open questions regarding the intra-function checks, so I will do those in a separate lab. I think it will be very important to split the register annotations into orthogonal axes for the different concerns, so things don't get totally mixed up and complicated.
- Writing down the tables for the expected behavior of `return` proved super useful. After that, the implementation was doable.
- Linear variables seem to work nicely.
- Testing all of this, with lots or corner cases, will be a large topic in its own right. Perhaps I can manually create a testing plan to cover as many corner-cases as I can think of, and let an LLM generate the test-cases.

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- [ ] activate `alloca` test-cases
- [ ] activate all annotation test-cases
- [ ] implement annotation test-cases validation pass for result annotations and activate unit tests
- [ ] write a pass to check that all variables have actually been allocated
- [ ] write a pass to check that all allocated variables are actually referenced at least once
- [ ] additional test cases to verify that the iterative solver is not doing in-place mutation via `join` and producing incorrect results somewhere
- [ ] would it be wise to inject a `deep_copy: (state: State) => State` function into the iterative solver? It could be used to create the in-set, to avoid any corruption of the out-set via accidental in-place mutation
- [ ] add a `call` instruction to the language, and analyze the lifetime and ownership semantics of argument passing and return values
- [ ] write down function argument and function return value semantics regarding life-time and ownership
- [ ] can aggregates, pointers, resource handles, closures, phi nodes, moving phi nodes, and in-place updates all be lowered into this DSL?
- [ ] create a plan of corner-cases to test
- [ ] extend the test-cases: find cases where it breaks!
- Do pointer types and resource handles have the same ownership semantics? Can the lifetime and ownership checks treat them the same way? What about a user-defined resource type? Does it suffice to mark it as _linear_, or does it have to be marked as a _Pointer_ as well? If so, does it make sense to rename _Pointer_ to _Handle_? How could a type be declared as a _Handle_? It would be a lot simpler if _linear_ is enough for those semantics.

---
**Copyright (c) 2026 Marco Nikander**
