# Question
<!-- What am I figuring out? -->

What is a lightweight way to implement reachability on directed graphs in Typescript?

Date: 2026-01-03

## Resources
<!-- Where can I find relevant information? -->

- [Algorithms, Sedgewick - Graphs](https://algs4.cs.princeton.edu/40graphs/)
- [Arbital: Order Relation](https://arbital.com/p/order_relation/)
- [Wikipedia: Reachability](https://en.wikipedia.org/wiki/Reachability)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- define a simple array-based edge representation
- create a function to compute the transitive closure of reachability
- write several unit tests to check for correctness

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
- after that I switched to arrays instead, and defined my own value-based equality function to use with `Array::find`
- for some reason strongly-connected components are not being computed correctly
- created another unit test with just two nodes which form a strongly-connected component, this replicated the issue that reachability is not being computed correctly for strongly-connected components
- the initial session was 4 hours, and I was tired, it's unsurprising I didn't really find the error
- after taking a 1 hour dinner break, I found and fixed the problem in 20 minutes
- the issue was down to two strongly connected nodes, with edges `(a, b)` and `(b, a)`, needing to introduce _two_ new reachability edges: `(a, a)` and `(b, b)` instead of just one new edge
- the implementation was modified to check both ways explicitly and add a new edge if possible
- added more test-cases to ensure cycles (strongly-connected components) are handled correctly

## Findings
<!-- What did I learn? -->

- I'm glad that I started implementing my first graph algorithm on something really simple
- taking a long break was super important to get unstuck, perhaps it would be a good idea to time-box my coding labs / plan a long break at a fixed time in advance, to avoid overburden in long sessions
- modelling edges as `[number, number]`, i.e. `[0, 1]` worked really well, it's simple and easy to use and much less typing than an object, i.e. `{ from: 0, to: 1 }`
- index-based access is error-prone, unless you define constants, so I didn't even consider it here
- an enmum for access, i.e. `edge[Get.from]` made the code difficult to read
- access functions `start(edge)` and `from(edge)` to retrieve elements 0 and 1 are really useful and made the code really easy to read -- they work wonderfully in this case

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- read the sources, to learn something!
- look up implementations from other people, to learn how to implement it faster and cleaner
- try depth-first and breadth-first search implementations
- experiment with different data representations: edge lists, adjacency lists, incidence lists, adjacency matrices to figure out which representations are easy to input into the algorithm and which ones are amenable to fast solvers
- try solving other monotonic problems with hand-crafted code
- compare the solutions and the implementation time to their datalog counterparts
- find resources on worklist algorithms and naive/semi-naive solvers for Datalog
- try implementing a naive or semi-naive solver

---
**Copyright (c) 2026 Marco Nikander**
