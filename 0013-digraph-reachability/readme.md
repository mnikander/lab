# Question
<!-- What am I figuring out? -->

What is a lightweight way to implement reachability on directed graphs in Typescript?

Date: 2026-01-03

## Resources
<!-- Where can I find relevant information? -->

- [Algorithms, Sedgewick - Graphs](https://algs4.cs.princeton.edu/40graphs/)
- [Arbital: Order Relation](https://arbital.com/p/order_relation/)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- define a simple array-based edge representation
- create a function to compute the transitive closure of reachability

## Running the Code
<!-- What steps are required to run the code? -->

```
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- started implementing reachability using sets
- wrote a unit test using a graph with 6 nodes, the same graph I had used in Datalog in lab 0012
- the `Set::has` function checks for pointer equality not value equality, so the checks for whether or not I already had a particular edge were not working correctly
- after that I switched to arrays instead, and defined my own value-based equality function to use with `array::find`
- for some reason strongly-connected components are not being computed correctly
- created another unit test with just two nodes which form a strongly-connected component, this replicated the issue that reachability is not being computed correctly in that case

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
