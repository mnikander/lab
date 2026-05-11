# Question
<!-- What am I figuring out? -->

Can a dataflow analysis check lifetimes of SSA variables in a function?

Date:   2026-05-06
Status: Doing

## Resources
<!-- Where can I find relevant information? -->

- _Static Program Analysis_, Moller and Schwartzbach
    - 5.3 Fixed Point Algorithms (pp 58)
    - Simple Work List Algorithm (pp 60)
    - 5.5 Available Expressions Analysis (pp 66)


Pseudocode from Moeller, _Static Program Analysis_, pp 60:
```
procedure SimpleWorkListAlgorithm(f1 , ... , fn)
    (x1 , ... , xn ) := (⊥, ... , ⊥)
    W := {v1 , ... , vn}
    while W ̸= ∅ do
        vi := W.removeNext()
        y := fi (x1 , ... , xn)
        if y ̸= xi then
            xi := y
            for each vj ∈ dep(vi) do
                W.add(vj)
            end for
        end if
    end while
    return (x1 , ... , xn)
end procedure
```

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [x] list expected inputs of the algorithm
- [x] list expected outputs of the algorithm
- [x] define a flat lattice on `{Undefined, Defined, Destroyed}`, i.e. `{Bottom, Undefined, Defined, Destroyed, Top}` or perhaps simplified to `{Bottom, Defined, Destroyed, Top}`
- [x] copy the define-use-free grammar from Lab-0018
- [x] adapt the grammar to have with numeric variable names, numeric block labels, and numeric function labels
- [x] copy the control-flow graph datatype from Lab-0019
- [x] define worklist with `contains`, `try_push`, `try_pop` operations which has a queue and a occupancy bitmask
- [x] create 6 code examples, 3 CFGs each with a happy paths and error path implementation:
    - 1. an entry block of straight-line code with a jump, and then a final block with straight-line code
    - 2. an entry block with a branch, left and right blocks, and a final join block
    - 3. an entry block, a loop block with a branch to itself, and a final block
- [x] hand-write ~~or generate~~ matching control-flow graphs for the example programs
- [x] implement a work list algorithm (see pseudo-code)

### Lattice
```
           Top
         /  |  \
  Defined   |   Dropped
         \  |  /
         Bottom
```

Revised to:
```
             Top
          /   |   \
         /    |    \
Undefined  Defined  Dropped
         \    |    /
          \   |   /
            Bottom
```

### Inputs
- program
- control flow graph
- list of all variables

### Outputs

- array of `("ok", state) | ("error", state, message)` for each variable

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

1. defined a 4 element lattice
2. copied and adapted a bunch of components from other labs and the IR repo
3. wrote end-to-end tests
4. wrote a bunch of code for the dataflow analysis and lattice, without being able to run any tests
5. refactored to more compact state representation
6. attemped data-flow implementation
7. spent a lot of time debugging bugs in a bunch of functions 
8. noticed several problematic corner cases
9. extended the lattice to distinguish "bottom" and "undefined"

### Simplification or Complication?
Simplifying the following allowed a function to be removed and simplified to code a bit overall:

```typescript
export type Element = "bottom" | "defined" | "dropped" | "top";
export type State = ["ok", Element] | ["error", Element, string];
```
to:
```typescript
export type State = ["bottom"] | ["defined"] | ["dropped"] | ["top", string];
```

... but it introduced a weird "error" state into the lattice, _above_ "top", which certainly does not belong there.
It makes program concerns more intertwined, so it makes it more complex to reason about.

## Findings
<!-- What did I learn? -->

- loops can be tricky to handle
- the lattice needs to differentiate between "bottom" and "undefined" so that back-edges can be processed directly
- "bottom" must act like a unit element in a join, when joined with something else, the result is that something else
- when a block has been processed, then all remaining "bottom" entries _must_ be set to "undefined" to signal that we know we didn't have the definition in this block, so that joining of blocks functions correctly (this was a major source of confusion)



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- handle multiple returns from a function, this requires changing how errors are accumulated
- cleanly separate the accumulation of errors from the state, there should not be an annotated "error" state which is above "top" in the lattice, that is mixing concerns
- investigate where most of the complexity in the code arises and see if there are ways to simplify the code
- define clear models for how stack and heap semantics work, and how they differ
- prototype the heap semantics
- clearly define the desired semantics regarding `define` and `drop` in loops, i.e. when there are cycles in the control-flow graph


### The Challenges of Loops
The following snippets raise the question: should a definition or a drop inside a loop be counted as a multiple-definition / multiple-drop error?

```
@loop:
    define 0    // error: possibly multiple definitions -- should this be an error?
    use    0    
    drop   0    // error: possibly multiple drops       -- should this be an error?
    branch [loop, successor]
```

Given that variable `0` is defined in a predecessor block:
```
@loop:
    use    0    // error: is possibly dropped in the previous iteration
    drop   0    // error: multiple drops       -- should this be an error?
    define 1    // error: multiple definitions -- should this be an error?
    branch [loop, successor]
```

### Static Single Assignment
For `define` we can get out of the hole by enforcing the static single assignment property in a separate pass before-hand, and then permitting multiple-defines in the dataflow analysis.

### Static Multiple Drops
For `drop` the situation is more complicated.
Unless single entry _and_ single exit are strictly enforced (as in structured programming), multiple returns are possible.
This means that while there is a single entry point where execution starts, there are several possible return points where execution ends.
A `drop` could occur along zero or more of those paths, and that is valid code.
Even if the structured programming theorem were strictly enforced, the following would still be valid code:

```
         define x
         use x
       /        \
    drop x     drop x
       \        /
         return
```
Thus, a single-drop cannot be enforced the same way that a single-assignment can be enforced.
Perhaps I need to do a _backward analysis_ for `drop`?
I could start a dataflow analysis at each `return`, and then trace back from there to the variable definition.
Along that route, I enforce that there must be 0 or 1 drops of each variable.
Can I just do a forward analysis though?
If I just define: multiple-drops of a variable is an error, regardless of whether it happens in a loop or not, then a forward analysis should be able to do it.
So perhaps a good idea is to say:
- `define` in a loop is valid
- `drop` in a loop is an error

Then what about a case where you `define` and `drop` the same variable within a loop?
```
@loop:
    define 0
    use    0
    drop   0
    branch [loop, successor]
```
Making that an error seems non-sensical.

### Availability Counting?
Can I use counting-technique to resolve this? 

| op       | counter update |
| --       | -- |
| `define` | `count = min(1, count + 1)` |
| `use`    | `count = count` |
| `drop`   | `count = count - 1` |

And then the following constraints are enforced:
- static single assignment: there is exactly one `define` for each variable in the program
- for a `use` the count must be exactly 1
- the count must always be 0 or positive, it must never be negative

### Strict Counting?

| op       | counter update |
| --       | -- |
| `define` | `count = count + 1` |
| `use`    | `count = count` |
| `drop`   | `count = count - 1` |

And enforce the following invariants:
- static single assignment
- for a valid `use` the count must be exactly 1
- the count must always be exactly 0 or 1

This allows a definition in a loop, but _only_ if that variable is also dropped there.
C/C++ programs do this a bit differently, a for-loop or while-loop is a brace-enclosed block which drops the locals at the end of the iteration.
This allows a C/C++ program to carry state forward from one iteration to the next, which is necessary for general iteration.
Iteration is only Turing-complete if state can be carried from one iteration to the next.
**This 'strict counting' approach is not Turing-complete.**

### Stack vs. Heap Semantics
If the variable is a **heap variable**, then multiple defines _are_ an error because multiple malloc calls are done.
Malloc is an effectful computation.
For a stack variable it doesn't matter because that storage is typically only allocated once at the beginning of the function, via an LLVM IR style `alloca`, and then freed on return when the stack frame is popped.
If the variable is a resource-handle (i.e. side-effects) then there may be reasons to drop it early, but for pure values there is no need to drop them early
... except for destructive updates.
Destructive updates may actually be quite common, but I don't necessarily have to deal with those drops explicitly.
Re-using the same storage space for a destructively updated variable is very similar to a register-allocation problem.
I may or may not have to deal with drops for stack allocated variables, which are destructively updated.
Drops for stack-allocated resource handles are definitely a possibility.
In a language like C/C++ you would create an extra scope within a function body, to express the constrained life-time of that stack-allocated variable.
I could model that as a kind of block-end, with the same destruction semantics as `return`.
A `return x` is really a "copy the return value to the agreed location" followed by a "pop stack frame" i.e. a `use x` followed by a `drop_locals`.

---
**Copyright (c) 2026 Marco Nikander**
