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
4. Started working on the CFG dominance example.

I think the monotonicity of Datalog may make it impossible to check whether or not there is exactly one edge coming into a particular node.
Discovering one incoming edge and then discovering a second incoming edge would first confirm and then violate that rule, which breaks monotonicity.
So I presume this won't be possible in Datalog.

Detecting a Split, which is more than one node above, is also pretty tricky.
This is because as soon as you start using the predecessor relation to detect a split, you have to ensure that it's not a linear chain of nodes, but that the parent is in fact the only common ancestor.

How do I encode that 'parallel' nodes in a DAG are not joined already?

Encoding this is non-trivial.
I going to learn more about Datalog before trying to solve this.

## Findings
<!-- What did I learn? -->

- Using Datalog via Racket is fast and easy.
- There could be big benefits to writing an interpreter in Racket. I might be able to pass the AST or IR into a Datalog program to do type-checking or other static analysis, and then returning to the execution in Racket. That could be a _really_ effective workflow.
- Logic programming is very different from the programming I've done in the past. It might be a good idea to familiarize myself with common techniques before I attempt to solve the more complicated problems.

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- Find a good introduction to Datalog, a blogpost, tutorial, or short book
- Do a number of practice problems / exercises to learn Datalog and common patterns

---
**Copyright (c) 2025 Marco Nikander**
