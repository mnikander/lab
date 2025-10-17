# Question
<!-- What am I figuring out? -->

How can the language of balanced parentheses be verified by a table-driven parser?

Note that this prototype was created several weeks ago, and was transferred into this repository retrospectively.

Date: 2025-10-05 (transferred into this repository on 2025-10-17)

## Resources
<!-- Where can I find relevant information? -->

- _Introduction to Compilers_, Thain

## Plan
<!-- What do I want to do? -->



## Hypothesis
<!-- What do I think is going to happen? -->

Perhaps it is easier to write a table-driven parser, than a recursive descent parser.
This could be really good, if I don't have to rewrite the parser every time I change my grammar.

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- determine the the 'first' and 'follow' sets
- write down the state transition table
- implement the stack machine
- created test-cases
- spent a lot of time working out bugs in the control flow

## Findings
<!-- What did I learn? -->

- writing a table driven parser in not so easy
- recursive descent is easier to implement

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- for faster modifications of the grammar and parser, it would be good to check out tools such as Langium and Bison

---
**Copyright (c) 2025 Marco Nikander**
