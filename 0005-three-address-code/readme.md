# Question
<!-- What am I figuring out? -->

How can an **evaluator for 3-address code** be implemented?

Date: 2025-10-25

## Resources
<!-- Where can I find relevant information? -->

- Introduction to Compilers, Thain
    - Chapter 8: Intermediate Representations
    - Chapter 10: Assembly Language
    - Chapter 11: Code Generation
- Compilers: Principles, Techniques, and Tools, Aho et al
    - Chapter 6: Intermediate-Code Generation

## Plan
<!-- What do I want to do? -->

- Typescript prototype a small set of operations
- implement call stack and program counter
- No parser, input directly via Typescript objects


### Instruction set

|Initial set |
| --- |
| load constant |
| add, mul |
| exit / return |

| Possible later additions |
| --- |
| label |
| jump |
| conditional jump |
| further arithmetic and logical operations |
| lambda / closure |
| call |
| return |
| heap alloc, free, load, store |
| scope begin, end |
| tail call |



## Hypothesis
<!-- What do I think is going to happen? -->



## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

Open questions / notes regarding `match`: 
Perhaps match doesn't work with side-effects, and I really should use returns, and assign the match result to the return register.
If I do that, then I need a way to encode the special case of exit, i.e. when there is no parent stack frame, where the result can be written.
Maybe I need to figure out a special type to encode the program return value as a destination, which is not a register.
Or I need a special entry frame, to which the result is written, but where the evaluator does nothing except take the result value and return it.

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
