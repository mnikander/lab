# Question
<!-- What am I figuring out? -->

How can a simple system be defined and checked?

Date:   2026-03-21
Status: In progress

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [x] define elementary types
- [ ] define unary arrow types (functions)
- [ ] write test-cases for type-checking
- [x] define equivalence relation on types
- [ ] implement a simple type-checker
- [ ] optional: extend arrows to n-ary functions, perhaps with `type Arrow  = { type: "Arrow", from: Type[], to: Type[] };`
- [ ] can type-deduction be done for generic functions?
- [ ] define sum and product types
- [ ] optional: define order relation on types (useful for casting Int8 to Int16 for example)

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined Top, Bottom, Unit, Bool, Char8, and Int64 to have a small assortment of types available
- defined equivalence relation


## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
