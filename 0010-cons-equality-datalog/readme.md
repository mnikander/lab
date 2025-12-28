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
- implemented inequality, by relying on `!=` and defining several extra rules

## Findings
<!-- What did I learn? -->

Somewhat surprisingly, it's possible to implement inequality on atoms, let-bindings, and cons-cells.
This can be done by leaning on `!=` and defining a larger set of relations.
Note that for two cons-cell to be unequal, it is sufficient if one of their entries differs, so _two_ disjoint relations are required for this.
As soon as one of the two entries is not equal, the cons-cells are not equal.


## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- implement `is-empty`

---
**Copyright (c) 2025 Marco Nikander**
