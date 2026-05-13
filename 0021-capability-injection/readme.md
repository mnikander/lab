# Question
<!-- What am I figuring out? -->

How can a side-effect capabilities be injected into modules?

Date:   2026-05-13
Status: Done

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [x] define a log capability
- [x] define a second capability like file read or state
- [x] create a "restricted module object" and a constructor for it
- [ ] write a positive and negative test case
- [x] confirm that the negative case fails type checking
- [ ] research if JS objects / functionality can be hidden behind a barrier which is secure

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno main.ts
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined capabilities, example modules, and main file
- tried creating generic functions but struggled and went for simpler examples instead
- split things into separate files for clarity

## Findings
<!-- What did I learn? -->

- supporting generic functions is tricky
- it's not clear how types can be exported from a module

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- Can such 'restricted modules' export _generic_ functions?
- Can such 'restricted modules' export types at all if they are implemented via objects?
- How type-safe is this? What mechnisms can a module use to increase its own permissions?
- Const-correctness is a bit tricky in JS/TS. How can directory access and other capabilities be restricted in a safe way, at runtime? Can those capability objects be made immutable in a way which is _secure_?
- How can monotone restriction of capabilities be implemented, i.e. that capabilities can be narrowed in submodules?
- Which side-effects does a general purpose language need?
- What is a good mapping of side-effects to capability interfaces? Should any be grouped together?

---
**Copyright (c) 2026 Marco Nikander**
