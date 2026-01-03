# Question
<!-- What am I figuring out? -->

How can **non-dominance** of CFG nodes be expressed using positive Datalog?

Date: 2026-01-02

## Resources
<!-- Where can I find relevant information? -->

- see lab 0007 for reference

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

Finding the dominator node `d` for a given node `n` in a control flow graph (CFG) `G` with an entry node `entry`, requires showing that _every path_ from `entry` to `n`, passes through node `d`.
Positive Datalog cannot express the universal quantifier, only existence.
We would need stratification to express the universal quantifier.
What we can do, is search for the existence of alternative paths, which bypass `d`, thereby showing that `d` is _not_ a dominator of `n`.

- implement graph reachablity
- hard-code an example CFG
- search for reachability from `entry` to some `n`
- add a loop to the CFG and test reachability again
- modify the reachability relation to add the intermediate node `d` and ensure `d` is _not_ visited
- run the example program
- note down findings

## Running the Code
<!-- What steps are required to run the code? -->

1. Install Racket
2. `raco pkg install datalog`
3. `racket ./non-dominance.datalog`

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined an example CFG without loop
- defined reachability relation
- added back-edge to create a loop
- tried and failed to define the non-dominator relation off the get-go
- defined `split`, `join`, and `reachable_without` to break it down into smaller steps
- it took severall hours to get the `reachable_without` relation to work correctly
- moved the reachability check for the excluded node `X` into it's own layer, so that those checks don't mess with the recursion -- which was the source of the problems

Let's compute the dominator set for the CFG in 'TEST CASE 1' to check our results.
We take the relation `path(S, F)` and form a set `P`, of the correspoding pairs `(S, F)`:
```
{
    (entry, entry),
    (entry, a),
    (entry, b),
    (entry, c),
    (entry, d),
    (entry, e),
    (a, a),
    (a, b),
    (a, c),
    (a, d),
    (a, e),
    (b, b),
    (b, e),
    (c, c),
    (c, d),
    (c, e),
    (d, c),
    (d, d),
    (d, e),
    (e, e),
}
```
We then take the relation `path_without(X, E, F)` and form a set `J`, of the corresponding pairs `(X, F)`:
```
{
    (b, e),
    (c, e),
    (d, c),
    (d, e),
}
```
Note the entries were sorted by hand, to make the comparison easier.
We can compute the set difference `Diff = P - J` and obtain:
```
{
    (entry, entry),
    (entry, a),
    (entry, b),
    (entry, c),
    (entry, d),
    (entry, e),
    (a, a),
    (a, b),
    (a, c),
    (a, d),
    (a, e),
    (b, b),
    (c, c),
    (c, d),
    (d, d),
    (e, e),
}
```

For the given CFG, we can manually determine the dominator set `dom(D, N)` where a node `D` dominates a node `N`.
`Dom(D, N)` is:
```
{
    (entry, entry),
    (entry, a),
    (entry, b),
    (entry, c),
    (entry, d),
    (entry, e),
    (a, a),
    (a, b),
    (a, c),
    (a, d),
    (a, e),
    (b, b),
    (c, c),
    (c, d),
    (d, d),
    (e, e),
}
```
which matches the set `Diff` exactly.
At least for this example, the computation appears to be working correctly.

## Findings
<!-- What did I learn? -->

### Non-Dominance seems to work
For the three test-cases, computing the results and then manually taking the set-difference correctly produces the dominator set.
The solution does seem to work.
This is no guaranty that the implementation is correct, but it's encouraging, and good enough for this proof-of-concept.

It took me six hours to work out this solution.
I still find it pretty tricky to work with positive Datalog.
I'm not sure if it would be easier with stratified negation, because in this instance I just negated the question.
It's good exercise to do it all from scratch, but it really does take a while.
When working with Datalog in the future, it might be good to search for existing solutions for the given problem.

I guess the interesting question is: if I can embed Datalog inside a Racket program, is it faster to solve a problem using Datalog, than to hand-write the code to solve the problem?
I can imagine that a hand-crafted solver may also have taken me six hours.
It's hard to say.

### Tricks to Print Text
A query with an empty result just prints an empty line.
For example if there is no rule for `_`, you can query: 
```
_?
```
... prints a newline (i.e. false):
```

```
You can also use a phoney `_note` predicate:
```
_note(0, "some text"). _note(0, X)?
```
... to print the following onto the screen:
```
_note(0, "some text").
```

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- Identify corner-cases worth testing
- Test those corner cases to check the solution for correctness
- Write a hand-crafted solver for this problem, in the programming language of my choice, measure how long it takes to implement, and compare it to the 6 hours for this solution. Which approach is more effective?

---
**Copyright (c) 2026 Marco Nikander**
