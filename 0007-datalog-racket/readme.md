# Question
<!-- What am I figuring out? -->

How can Datalog be used to verify properties on graphs?

Date: 2025-12-18

## Resources
<!-- Where can I find relevant information? -->

- [Racket Datalog docs](https://docs.racket-lang.org/datalog/index.html)
- [Wikipedia: Datalog](https://en.wikipedia.org/wiki/Datalog)

## Plan
<!-- What do I want to do? -->

1. Install a version of Datalog which I can run on my system
2. Try a simple graph reachability example
3. Try to compute 'dominance frontier' for a control flow graph in the context of static single-assignment form

## Hypothesis
<!-- What do I think is going to happen? -->

1. There will probably be an Ubuntu package I can just install
2. Graph reachability is an easy problem, I expect no surprises
3. I'm not sure if the dominance frontier can be calculated via Datalog, but I'll just try it out and see if I can make it work

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

1. tried installing Souffle on Ubuntu by adding it to sources, but it couldn't install the dependency 'libffi7'
2. installed a Racket package instead: `raco pkg install datalog`
3. wrote an example for reachability and executed it with `racket ./reachability.rkt`
4. 

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
