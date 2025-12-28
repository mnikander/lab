# Question
<!-- What am I figuring out? -->

How can the equality of lists, constructed of cons-cells, be tested in Datalog?

Date: 2025-12-28

## Resources
<!-- Where can I find relevant information? -->

- none

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- model cons cells in Datalog
- model the equality relation on cons cells in such a way that recursive data structures can be checked for equality

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- started modeling cons cells and equality
- introduced handles, i.e. a global identifier for each object, to be able to link things together
- decided to split `atom` into it's own relation, to make it more clear what is a handle and what is a value
- implemented `let` as a way to alias an existing object
- implemented cons-cells
- implemented equality
- added `nil` as the empty element / unit type, to model the end of a list (`null` seems to be used by Racket, so it was best to avoid the collision)


## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
