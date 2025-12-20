# Question
<!-- What am I figuring out? -->

How can I solve logic problems using Datalog?

Date: 2025-12-19

## Resources
<!-- Where can I find relevant information? -->

- [Racket Datalog module language](https://docs.racket-lang.org/datalog/datalog.html)
- [Racket Datalog tutorial](https://docs.racket-lang.org/datalog/Tutorial.html)
- [Souffle tutorial with exercises](https://souffle-lang.github.io/tutorial)
- [Modus ponens](https://en.wikipedia.org/wiki/Modus_ponens)
- [Modus tollens](https://en.wikipedia.org/wiki/Modus_tollens)

## Plan
<!-- What do I want to do? -->

Go through the Souffle tutorial using Datalog in Racket.
If a feature is not availble in Racket-Datalog, then I can either install Souffle, or just skip over that feature.

0. do [modus ponens](https://en.wikipedia.org/wiki/Modus_ponens) and [modus tollens](https://en.wikipedia.org/wiki/Modus_tollens)
1. go through the [Racket Datalog tutorial](https://docs.racket-lang.org/datalog/Tutorial.html) and type in the example
2. do exercise [Transitive Closure](https://souffle-lang.github.io/tutorial#transitive-closure) -- i.e. 'reachable'
3. do exercise [Same generation](https://souffle-lang.github.io/tutorial#same-generation-example)
4. do exercise [Data-flow analysis](https://souffle-lang.github.io/tutorial#data-flow-analysis-example)
5. work through [Arithmetic expressions](https://souffle-lang.github.io/tutorial#arithmetic-expressions)
6. work through [Aggregation](https://souffle-lang.github.io/tutorial#aggregation)
7. work through [Records](https://souffle-lang.github.io/tutorial#records)
8. look at [Components](https://souffle-lang.github.io/tutorial#records)
9. Skim [Performance and profiling facilities](https://souffle-lang.github.io/tutorial#records)

## Hypothesis
<!-- What do I think is going to happen? -->

I am going to do the exercises and learn something, probably quite a lot.
I hope I can get through those two tutorials and their examples in one or two days.

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- implemented modus ponens and modus tollens easily
- went through the Racket Datalog tutorial in about an hour

### Exercise: Transitive Closure
- implemented a check for cyclic graphs
- couldn't find a way to implement a check for acyclic graphs, without access to stratified negation
- checking for a strict ordering of the graph may be an approch to showing it's also acyclic, but I don't know how to implement that yet

### Exercise: Same Generation
- learned how to extract the list of nodes
- learned a trick to recurse to a common shared node with exactly equal count
- learned that sometimes you need to wrap a rule in order to apply a filtering predicate
- extended the implementation to find all nodes on the other side of a split

### Exercise: Data Flow Analysis
- wrote down the control flow graph for the exercise, it took a while to create the ASCII art by hand
- An interesting note is that there can be an arbitrary number of incoming edges, but if you only have (1) an unconditional jump and (2) a binary branch instruction, then there are exactly 1 or 2 edges leading out of a block. This could be of enourmous significance in terms of what you can and cannot test, depending on the direction in which you traverse the CFG.


## Findings
<!-- What did I learn? -->

- sometimes it is helpful to wrap an implementation in a new rule, to be able to apply filters properly

### List of nodes / type predicates
You can list all the entities which take part in a relation, using a simple rule with a free variable (essentially a wildcard):
```datalog
edge(a, b).
edge(a, c).
edge(b, d).
node(X) :- edge(X, O).
node(X) :- edge(O, X).
node(X)?                % list all nodes
node(a)?                % only true if 'a' is a node
```

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
