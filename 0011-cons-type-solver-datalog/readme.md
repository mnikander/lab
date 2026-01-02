# Question
<!-- What am I figuring out? -->

Can cons-cells be used to type-check multi-argument functions using Datalog?
How can multi-argument functions be type-checked using Datalog?

Date: 2025-12-28

## Resources
<!-- Where can I find relevant information? -->

- see labs 0007, 0008, 0009, and 0010 for helpful examples

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
- type-checked function call for a unary function `flip`
- added signature and test-cases for a binary function `mix`
- changed the encoding of the type signature, now `i2 -> i2 -> i2` is encoded as `(i2 . (i2 . (i2 . nil)))`, same for the list of arguments
- wrote a recursive helper function `match` which enforces that arguments match the corresponding entry in the type signature
- fixed a bunch of bugs in `match` and `typeof`
- removed the cons equal and unequal, since I didn't need them
- clarified naming of argument lists in the test-cases
- tested it on a ternary function

## Findings
<!-- What did I learn? -->

- keeping the relations small, with few arguments, is helpful
- many small relations provide many opportunities to document which relation does what, and increases separation of concerns
- it's really good to prototype a bit first, to find a good design
- it's really good to have a clear concept on how to structure the program, and then stick to that style/design consistenly, through the entire program -- this feels even more important here than in normal coding
- using cons-cells function signatures and argument types works, but it quickly gets unwieldy

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- enforce that all required terms have been type-checked correctly (unit test this with an example containing a badly typed term)
- test it on functions which take tree shaped inputs (i.e. function arguments)
- test it on functions which return a function
- it would be really nice to get syntax highlighting for Racket-Datalog in VS Code

---
**Copyright (c) 2025 Marco Nikander**
