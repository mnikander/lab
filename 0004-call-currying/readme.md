# Question
<!-- What am I figuring out? -->

How can a function call node in an AST be split into two nodes, for currying?

Date: 2025-10-16

## Resources
<!-- Where can I find relevant information? -->

No reading, just wing it, using prior experience.

## Plan
<!-- What do I want to do? -->

- Define a type for a function call node
- Define a type for an argument, which has a link to a possible next argument
- Define a placeholder type for expressions, which may have child nodes
- Give every node an Id so that correct insertion can be verified
- Define 3-5 test-cases for currying
- Implement a recursive AST walk which distinguishes between call, argument, and expression nodes
- Implement splicing in of new nodes

## Hypothesis
<!-- What do I think is going to happen? -->

I expect that splicing a new node in will be relatively easy, but I'm unsure how to keep track of the argument list.
I suspect that keeping track of the shrinking argument list, and perhaps currying multiple times, may prove tricky.

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined types with optional children to make initialization easier
- got rid of numeric Ids because they'd be broben after the first insert -> just use string names to identify the original nodes instead
- I simplified the initial type definitions several times, to avoid every excess node that I could
- `console.assert` is not such a good choice, because the deno unit test passes even when it lists assertions as failed
- I installed the 'expect' package via `deno add jsr:@std/expect` so that tests pass/fail correctly

## Findings
<!-- What did I learn? -->

- I have to pay very close attention to which argument goes where
- keeping the parent node and expanding into the subtree works well, you don't have to insert above the current node
- storing the arguments as a forward list works well
- The argument list reminds me a lot of a cons-cell, especially if you don't put the value into the argument list node directly, but instead hold a pointer to the value in `first` and a pointer to the tail in `second` -- I bet the creators of Lisp noticed exactly this, early on
- The top function call node needs the last entry from the list of arguments, which requires traversing the list of arguments to the end. That's a little annoying from the standpoint of code simplicity and runtime performance of this pass -- a reverse list would be nice.

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- try test cases where the arguments are nested expressions as well, to make sure those work
- implement currying for function abstraction as well

---
**Copyright (c) 2025 Marco Nikander**
