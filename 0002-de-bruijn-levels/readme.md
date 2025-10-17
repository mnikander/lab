# Question
<!-- What am I figuring out? -->

How can de Bruijn levels be used to evaluate unary lambda calculus?

Date: 2025-06-08 (transferred into this repository on 2025-10-17)

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->

- implement evaluation of lambda calculus for unary functions only
- identify parameters by their de Bruijn level

## Hypothesis
<!-- What do I think is going to happen? -->

- unary lambda calculus will be easier than n-ary for the start

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- moved code from the interpreter repo into this repo
- `deno add jsr:@std/testing/bdd` allowed me to keep the behavior-driven test-cases

## Findings
<!-- What did I learn? -->

- evaluating unary lambda calculus is doable with a hundred lines of code
- de Bruijn levels are useful, but I will try out unique global Ids in my interpreter to decrease the risk of confusion

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- try out de Bruijn _indices_
- understand the pros and cons of de Bruijn indices and levels
- contrast the pros and cons with global Ids

---
**Copyright (c) 2025 Marco Nikander**
