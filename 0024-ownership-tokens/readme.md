# Question and Hypothesis
<!-- What am I figuring out? -->

1. How can ownership tokens be defined?
2. Where are ownership tokens created and destroyed?
3. How do you compute which variables depend on which tokens?

Date:   2026-05-28
Status: Planning

## Resources
<!-- Where can I find relevant information? -->

- lab 0023

## Hypothesis
<!-- What do I think is going to happen? -->

I think the token definition can be written at the parameter / alloca slot declarations.
I think the existence of the token itself should be coupled to the introduction / elimination of the resource though.
That would mean the token only exists once the variable has been declared _and_ defined.

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Plan & Implementation
<!-- What did I do? -->

- [x] define Basic and Pointer types -- trivial placeholders may be enough for the DSL
- [x] define the Token type
- [x] does it make sense to model the token type as a single tuple, or should they be attributes which are composed onto the Type, i.e. `(unique (local (ptr int)))`? That would make defaulting easier, and makes is easier to implement the attributes one at a time. -- I'll keep the explicit tuple formulation for now, so the Token is concrete in the code
- [x] define an IR-like grammar which models define, use, copy, move, ~~update~~, drop, own, borrow
- [ ] create test-cases with examples
- [ ] copy and adapt the code for control flow graph construction
- [ ] define the lattice or state for the worklist algorithm to create the dependency graph
- [ ] copy and adapt the worklist algorithm from lab 23
- [ ] do I need to differentiate abstract tokens (unknown location outside the function) from concrete tokens where we know the storage location exactly?


## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- [ ] add construction and destruction of aggregates to the DSL
- [ ] Can token operations be modelled explicitly in the DSL? This may allow expressing high-level constructs with a smaller number of primitives and may simplify the analysis, at the cost of complicating the lowering pass slightly


---
**Copyright (c) 2026 Marco Nikander**
