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

## Steps
<!-- What did I do? -->

- [ ] define the Token type
- [ ] define a DSL which models define, access, drop, own, borrow, clone, move, update
- [ ] define Basic and Pointer types
- [ ] plan how to compute the dependencies

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- [ ] add construction and destruction of aggregates to the DSL


---
**Copyright (c) 2026 Marco Nikander**
