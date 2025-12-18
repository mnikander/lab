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


## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
