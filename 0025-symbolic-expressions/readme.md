# Question and Hypothesis
<!-- What am I figuring out? -->

1. How can simple symbolic expressions be encoded in JSON?
2. How can this be made type-safe using the type system in TypeScript?

Date:   2026-08-10
Status: Done

## Resources
<!-- Where can I find relevant information? -->

- Minimal Lisp BNF: https://iamwilhelm.github.io/bnf-examples/lisp

## Hypothesis
<!-- What do I think is going to happen? -->

Should be straight-forward to encode with JSON arrays.

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Steps
<!-- What did I do? -->

1. defined types
2. tried tagged types for literals, i.e. `["boolean", true]` but decided not to use them because they are too verbose
3. decided to not support strings for the moment, since they create ambiguity with variables, which must be resolved somehow
4. wrote several test-cases which show-case the use of typescript's type system to check terms for syntactic correctness
5. implemented predicates which can identify Atoms and Lists as such
6. added string support using template literal types
7. added runtime checks to the type guards to enforce the naming convention of symbols

## Findings
<!-- What did I learn? -->

- It is very easy to encode simple symbolic expressions in JSON and check them via the TypeScript type system.
- The ambiguity between symbols and strings can be resolved using template literals
- Naming conventions for symbols cannot be checked at compile-time, since template literals don't allow regex

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- How can pattern-matching be implemented for these symbolic expressions?
- How can term-rewriting be implemented via a catamorphism (i.e. fold) or paramorphism?
- How can transformations and validations of an Expr be implemented with a unified interface?
- Can transformations and validations be cleanly chained via a Result-type and flat-map?

---
**Copyright (c) 2026 Marco Nikander**
