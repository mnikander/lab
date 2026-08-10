# Question and Hypothesis
<!-- What am I figuring out? -->

1. How can symbolic expressions be encoded in JSON?
2. How can this be made type-safe using the type system in TypeScript?

Date:   2026-08-10
Status: 

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

## Findings
<!-- What did I learn? -->

- The ambiguity between symbols and strings must be resolved somehow, one option might be to tag strings as such, but then they no longer have the same structure as the other atoms. It would be a shame if all the atoms would need to be tagged, since that would be terrible for readability.

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- How can term-rewriting be implemented via a catamorphism (i.e. fold)?

---
**Copyright (c) 2026 Marco Nikander**
