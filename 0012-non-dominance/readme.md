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

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined an example CFG without loop
- defined reachability relation
- added back-edge to create a loop
- tried and failed to define the non-dominator relation off the get-go
- defined `split`, `join`, and `reachable_without` to break it down into smaller steps

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

We take the relation `path_without(X, E, F)` and form a set `J`, of the corresponding pairs `(X, F)`:
```
{
    (b, e),
    (c, e),
    (d, c),
    (d, e),
}
```

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

A query with an empty result just prints an empty line.
For example if there is no rule for `_` you can query: `_?` to print a newline to the screen.

You can also use a phoney `_note` predicate to print something on the screen:
```
_note(0, "some text"). _note(0, X)?
```
prints:
```
_note(0, "some text").
```

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
