# Question
<!-- What am I figuring out? -->

How can a line-by-line availability analysis, inside a single basic block, be implemented?

Date:   2026-10-08
Status: Done

## Resources
<!-- Where can I find relevant information? -->

- [lab 18](0018-lifetime-language/readme.md)
- [lab 23](0023-ownership-dsl/readme.md) especially the [tests](0023-ownership-dsl/main.test.ts)

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Description
<!-- How do I want to approach the problem? -->
<!-- What do I think is going to happen? -->

**Inputs**
1. `VariableState[]` - Variable states at the beginning of the block (from CFG availability analysis)
2. `number[][]` - Points-to set
3. `Line[]` - IR code for the block 

**Outputs**
1. Result containing the variable states at the end of the block, or an error message (which includes the line number)

## Steps
<!-- What did I do? -->

- [x] copy/paste VariableState from lab 27
- [x] define function signature
- [x] create trivial test-cases
- [x] define simplified grammar for source language, including block parameters
- [x] define DSL define/use/drop/return
- [x] for each instruction, translate it into a combination of define/use/drop/return
- [x] update the variable states using the DSL ops
- [x] iterate over the lines
- [x] interpret pointer drops as pointee uses
- [x] if any errors occur, return an error message, otherwise return the update states at the end
- [x] return must 'use' all variables which are not Destroyed
- [x] return value must be used
- [x] return value's points-to set must be used
- [x] use of a pointer-type variable should also be a use of its pointee
- [x] test let
- [x] test unary (with/without borrow)
- [x] test binary
- [x] test return (with/without borrow)
- [x] test drop
- [x] test borrow
- [x] test load
- [x] test jump
- [x] ensure that whenever a borrow is dropped, no matter how, the points-to set is used
- [x] test call (with/without borrows)
- [ ] replace `return` with `jump` in most test-cases, so that `return` is not accidentally catching issues which other commands should catch earlier on
- [ ] test branch (with/without parameters, with/without borrows)
- [ ] test binding of block parameters (with/without borrows)

## Findings
<!-- What did I learn? -->

### Needs lots of tests

Various instructions, variable states, and move/peek access create a huge number of possible permutations.
It would require hundreds of test-cases to check all the relevant cases.

### 'Ambiguous' state may not be precise enough for drop-during-return

I think there is a problem with the current handling of borrows which are cleared by a return. If a borrow is Undefined and Destroyed, then it is Ambiguous. Returning some other resource, should _not_ trigger an error for the Ambiguous borrow. It does not need to be dropped since it is Undefined and Destroyed. There is only one Ambiguous state, however. That ambiguous state is treated as if one of its constituent states is Available. This causes my analysis, specifically the `translate_return` function, to reject valid code. To solve this issue, I would probably need to switch to a power-state lattice. This would allow differentiating `Undefined`/`Destroyed` from `Undefined`/`Available`. In the first case there would be no need to check the points-to set of the borrow. In the second case, the point-to set must be used. 
<!-- TODO: can I create a test-case which reproduces this issue? -->

### It's better to end a test-block with `jump` than `return`

While writing tests for function calls, the analysis picked up an error which it does not know how to detect. It was detecting that function was called, where the argument is a dangling pointer. This is something I want to detect, but the code cannot do yet. It was mysterious that it was detecting those errors for some test-cases. On closer inspection, it turned out that the analysis was detecting an error for the code `let %2 = call @1 (peek %1)`. It was _not_ detecting an error for `let %2 = call @1 (move %1)`. This was very strange.

Both test-cases ended with `return %2`. When doing `return %2`, any other variables such as `%1` are cleared. That cleanup involves a use of its points-to set. That is when the 'peek' version of the test was finding out that the pointer was dangling. The 'move' version of the test was not finding this problem, since the pointer was already destroyed anyway, so its points-to set was not being checked as part of return.

To alleviate this issue, it is _highly recommended_ to write the tests for the line-by-line analysis in such a way that the block ends with a `jump`. A `jump` is a no-op from the perspective of variable availability. This ensures that any errors which are to be detected, are actually detected where they are caused, and not accidentally caught by the `return` statement.

### Points-to set is essential

At certain locations in the code, a borrow must be checked for validity.
Specifically, this is whenever:

1. a borrow is dropped
2. a borrow is moved
3. a borrow is passed into a function
4. a borrow is loaded from

The points-to set is needed for borrow-checking.
A borrow is valid at a given point in the program when everything the borrow might point is Available.
The lifecycle DSL has the form `(define | use | drop) Id`.
Borrow-checking can be done by lowering into the DSL.
The cases where a borrow must be checked for validity, are encoded by inserting a 'use' for every variable which the borrow might point at.
This enforces that the entire points-to set is Available.

**Example**: An IR `drop b` is interpreted as a DSL 'use' of the entire points-to set of `b` followed by a DSL `drop b`.
This ensures that the entire points-to set is still alive, at the time when `b` is dropped.

There are a lot of places where drop, move, or function calls can occur.
Thus, the points-to set is needed in almost all of the functions which translate the IR to the DSL.

### Arguments are all passed simultaneously

The following code snippet _must_ be rejected by the analysis:
```
%a = 42
%b = borrow a
%r = call @foo (peek %b) (move %a)
```
The variable `%b` points at `%a`.
Even though `%a` is Available before the function call, it is dropped during the function call.
This means that `%a` is not available and that `%b` is a dangling reference during the execution of the function `@foo`.

On the flip side, the following is actually useful:
```
%a = 42
%r = add (peek %a) (move %a)
```
Here, `%a` is not a borrowed type.

In general, **when an AST node takes two or more operands, and at least one of them is a borrowed type, there is a danger of inconsistencies**.
This risk is most obvious with function calls and branching to a block with parameters.
There are several ways of resolving this:

1. simultaneous ownership transfer of all operands
2. check the validity of the points-to set for each borrow-type argument, after all the define-use-drop operations have been done
3. analysis which checks specifically for inconsistencies when borrowed type operands are present

#1. The **simultaneous ownership transfer of all arguments** can be implemented by:
- Making every use of a borrow, a use of its points-to set
- Sorting the define-use-drop operations for a line of code, into a drop-use-define order, which is conservative and safe
Simultaneous ownership transfer breaks the `add` example from above.
This was the approach chosen for now, because it's simple, safe, and the code stays clean.
Other approaches seem to require more corner cases or more finesse.

#2. **Checking of validity of borrows after all moves** can be implemented by:
- Modifying the translation to the define-use-drop DSL of arguments
- One way to do this might be to distinguish the validity checks of the points-to set. Instead of `["use", %1]` any borrow type argument could have their own tag, i.e. `["check", %1]`. The 'piggyback' trick is only applied at the very end, after all other operations. This is done by sorting all of the "check" ops to the back, and then expanding them to "use" of the points-to set.

### Number and type of block parameters must be checked

Just like for a function call, the number and type of block parameters need to be checked.
At every `branch` instruction, they need to be checked against the block definition.

### Block bindings are like let-bindings before the first line

Prior to analyzing the lines in a block, the bindings must be evaluated in the define-use-drop DSL.

### Branch with arguments is tricky for the translation to DSL

Take this example:
```
(branch 
  (constant 1)
  (target ^1 (arguments (move %0)))
  (target ^2 (arguments (move %0))))
```
If the translate function just translates the condition line and the two target lines into the DSL, and executes them, then there is a double-drop error.
This happens because it looks like `(move %0)` happens twice.
In reality, only one of those two branches is chosen, so only one of those two moves is actually executed.
If the branch targets are the same, the result may be an ambiguous state:
```
(branch 
  (constant 1)
  (target ^1 (arguments (peek %0)))
  (target ^1 (arguments (move %0))))
```
In this case, `%0` must be ambiguous at the entry to block `^1`.

I need to think about this in terms of the CFG edges, and not the state at the end of the block.
The operations in the `target`-term occur **on the CFG-edge to that successor, and _not_ in the last line of the block**.
I probably need a way to express Ops along a CFG edge.
One possibility is to introduce additional edge-blocks.
These edge blocks are necessary exactly if one or more arguments are moved.
Then all of the ops, even the uses, must be delegated to a special edge-block and computed there.

Does it make sense to restrict the language so that only graphs can be built which follow this rule?
One way to do this might be to allow a Jump to `{peek,move}` its arguments, and to allow a branch to only `{peek}` its arguments.
That would enforce that the IR code has extra edge blocks when they are needed.

The alternative is that I expand the analysis, to check things as if those edge-blocks are there.
That would mean that the line-by-line analysis ignores the Terminator statement, and outputs the state at the end of the block.
The CFG analysis would have to look at the terminators, and process those accordingly.
That's an OK option actually, but it would require me to change the API and semantics of the CFG analysis.

### Escape analysis

The points-to-set of the result may only contain parameters, no local variables.
This could be built into `translate_return`, but it's probably better to have it's own small analysis pass.
Separation of concerns.
That way each pass can get exactly the inputs which it needs and the code is also easier to reason about.

### Explicit lowering from IR to DSL

Currently, each line in the IR is lowered to the DSL individually and then processed immediately.
Perhaps it's possible to write cleaner code by doing one lowering pass from the IR to the DSL.
A special virtual machine could then execute the DSL to do the line-by-line availability anaylsis.
The code for that might be easier and cleaner.
One downside is that debugging may be more difficult.
A way needs to be found to associate which IR lines correspond to which DSL lines.
This is relevant both for debugging, and for later error messages.

## Conclusion

This lab yielded a first implementation for a line-by-line availability analysis.
Several things were identified:
- in addition to their creation and destruction sites, borrows must be checked when they are passed to another function as well
- arguments passed to functions or blocks must be treated as if they are passed simultaneously, to detect errors when passing a variable and a reference to that variable (which is not allowed)
- correct semantics for dropping of branch arguments requires drops to occur on the control-flow edges, not at the start/end of the blocks
- hundreds of test-cases are needed to test even a relatively small set of corner-cases

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- add edge blocks, so that if a variable is dropped as part of a branch with parameters, the drop actually happens along the edge
- switch to a power state lattice, so that ambiguous states which do or don't require a drop can be distinguished, i.e. `(Undefined, Available)` which needs a drop and `(Undefined, Dropped)` which does not need a drop
- explicitly lower the IR to the DSL
- more tests, perhaps find a more systematic way to test the possiblilities, or use property-based testing such as Quick Check

---
**Copyright (c) 2026 Marco Nikander**
