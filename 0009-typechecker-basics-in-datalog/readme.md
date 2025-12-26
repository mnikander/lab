# Question
<!-- What am I figuring out? -->

How can a basic type-checker be implemented in Datalog?

Date: 2025-12-26

## Resources
<!-- Where can I find relevant information? -->

- [Racket Datalog tutorial](https://docs.racket-lang.org/datalog/Tutorial.html)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- create a Racket-Datalog file and define a relation for a variable binding
- design a type-system with (1) a unit type for all values and (2) an arrow type for functions
- design a representation in Datalog for (1) variable definitions, (2) function definitions, (3) function calls
- think about whether it makes sense to encode a basic block, which contains the above instructions, as a graph in Datalog, or whether you do all the CFG processing outside and only input the facts into Datalog

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

### 1st Attempt: Model a Small Program in Datalog

I tried to represent the following program in Datalog directly:
```
foo :: green -> green
let r: red   = empty
let g: green = empty
let b: blue  = empty
let i: green = (foo g)
let j: blue  = (foo g)  % error
```

This raised a lot of questions:

Could I create curried function definitions, and basically just do simply-typed unary lambda calculus as my first example?
How do I encode nested lambdas?
How do I encode return types?
How do I chain the function type signature to be something like `unit -> unit -> unit`?
Do I have to give the intermediate lambdas a name, to be able to chain them in Datalog?

To check that the type-checking is actually working, it might be better to have 2-3 types available.
For example, the types could be `red`, `green`, `blue` and functions thereof.

Should I use cons-cells to encode function calls, argument lists, and other information?
Or should I use a dedicated relation for each one?

### 2nd Attempt: Start Simple, Take it Slow



## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
