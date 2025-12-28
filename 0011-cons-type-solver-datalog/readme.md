# Question
<!-- What am I figuring out? -->

Can cons-cells be used to type-check multi-argument functions using Datalog?

Date: 2025-12-28

## Resources
<!-- Where can I find relevant information? -->

no idea

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- create a type solver (i.e. solve for a valid typing)
- build it from the ground up using atoms and cons cells
- keep everything as simple and uniform as possible from the start
- use a 3-layer architecture consisting of facts, helpers, and the query
- try to model multi-argument functions

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- copy/pasted cons-cell implementation from 0010
- removed the let-binding from the scope, to keep things simple
- introduced a special value 'func' as a placeholder for function bodies
- removed the placeholder, and instead created a new relation `func` specifically for the purpose, which makes the code more readable -- minimize unnecessary clutter
- type-checked function call for a unary function

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
