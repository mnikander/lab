# Question
<!-- What am I figuring out? -->

Can a dataflow analysis check lifetimes of SSA variables in a function?

Date:   2026-05-06
Status: Doing

## Resources
<!-- Where can I find relevant information? -->

- Static Program Analysis, Moller and Schwartzbach
    - 5.3 Fixed Point Algorithms (pp 58)
    - Simple Work List Algorithm (pp 60)
    - 5.5 Available Expressions Analysis (pp 66)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [ ] list expected inputs of the algorithm
- [ ] list expected outputs of the algorithm
- [ ] define a flat lattice on `{Undefined, Defined, Destroyed}`, i.e. `{Bottom, Undefined, Defined, Destroyed, Top}` or perhaps simplified to `{Bottom, Defined, Destroyed, Top}`
- [ ] copy the define-use-drop grammar from Lab-0018
- [ ] adapt the grammar to have with numeric variable names, numeric block labels, and numeric function labels
- [ ] create 3 code examples (or copy and adapt them from Lab-0018 and the IR repo):
    - 1. an entry block of straight-line code with a jump, and then a final block with straight-line code
    - 2. an entry block with a branch, left and right blocks, and a final join block
    - 3. an entry block, a loop block with a branch to itself, and a final block
- [ ] take the control-flow graph datatype from Lab-0019 (and hard-code some sensible block names, even if they are all just indices)
- [ ] hand-write or generate matching control-flow graphs for those programs
- [ ] define worklist with `has`, `add`, `pop` operations which has a queue and a occupancy bitmask
- [ ] implement a simple work list algorithm (see: Static Program Analysis, pp 60)

Lattice:
```
           Top
         /  |  \
  Defined   |   Destroyed
         \  |  /
         Bottom
```

From Moeller, Static Program Analysis, pp 60:
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

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->



## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
