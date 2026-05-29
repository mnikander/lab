# Question and Hypothesis
<!-- What am I figuring out? -->

1. How can ownership tokens be defined?
2. Where are ownership tokens created and destroyed?
3. How do you compute which variables depend on which tokens?

Date:   2026-05-28
Status: Doing

## Resources
<!-- Where can I find relevant information? -->

- lab 23

## Hypothesis
<!-- What do I think is going to happen? -->

I think the token definition can be written at the parameter / alloca slot declarations.
I think the existence of the token itself should be coupled to the introduction / elimination of the resource though.
That would mean the token only exists once the variable has been declared _and_ defined.

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Operations and Dependencies on Tokens

| Operation         | Dependencies                                 | Comments |
| :--               | :--                                          | :--      |
| `x = constant`    | `deps x = empty`                             | |
| `x = add a b`     | `deps x = empty`                             | `add` is a stand-in for all arithmetic and logical ops |
| `x = copy a`      | `deps x = deps a`                            | |
| `x = move a`      | `deps x = deps a`                            | |
| `x = own a`       | `deps x = union (token a) (deps a)`          | Does this work correctly if `a` is a pointer or primitive? |
| `x = borrow a`    | `deps x = union (token a) (deps a)`          | Does this work correctly if `a` is a pointer or primitive? |
| `x = phi a b`     | `deps x = union (deps a) (deps b)`           | |
| `x = load a`      | `deps x = deps a` **OR** `deps x = empty`    | Conservative over-estimation. See notes below. |
| `x = call a b ...`| `deps x = union (deps caller_or_global_args)`| See notes below. |
| `x = drop`        | no change                                    | Drop ends the lifetime, dependencies unchanged |
| `branch x [L R]`  | no change                                    | |
| `return x`        | no change                                    | `x` is moved out, all local lifetimes end, dependencies unchanged |

### Load

For the case of `x = load a`, we need the dependencies of whatever `a` is pointing at: `deps x = deps (deref a)`.
If `a` is a function parameter, then we cannot determine what it's pointing at, without doing whole-program analysis.
We can estimate the dependencies conservatively by saying `deps x = deps a`.
We can simplify this if `a` is a pointer to a primitive type.
If, for example, `a` is a `borrow int` then we can treat the `load a` like `copy` of an `int`.
So `x = load a` causes `deps x = deps a`, unless `a` points to a primitive, in which case `deps x = empty`.
If the target is local to the function, then in the future we could use pointer analysis to compute the set of possible targets and arrive at a more precise result.

### Call

The dependency set of a function result is decided by the parameters.
All parameters which the function signature declares as "caller" or "global" scope, may flow into the result.
For a function call `x = call a b ...` we must check which arguments are passed into parameter slots marked as "caller" or "global".
We retrieve the dependencies of each of those arguments, and compute the union of those dependencies.
That is the dependency set of the result, i.e. `deps x`.

## Plan and Implementation
<!-- What did I do? -->

- [x] define Basic and Pointer types -- trivial placeholders may be enough for the DSL
- [x] define the Token type
- [x] does it make sense to model the token type as a single tuple, or should they be attributes which are composed onto the Type, i.e. `(unique (local (ptr int)))`? That would make defaulting easier, and makes is easier to implement the attributes one at a time. -- I'll keep the explicit tuple formulation for now, so the Token is concrete in the code
- [x] define an IR-like grammar which models define, use, copy, move, ~~update~~, drop, own, borrow
- [x] merge Type information into Token type
- [x] refactor test-cases to build Tokens algebraically, using functions, to make the code more readable
- [x] create a few test-cases with examples
- [x] document a table of operations and their impact on dependencies
- [ ] implement `compute_tokens` which takes a Function and computes its set of Tokens from the params and allocas
- [ ] extend `compute_tokens` so that the abstract tokens (targets of pointer-valued arguments) are created as well
- [ ] do I need to differentiate abstract tokens (unknown location outside the function) from concrete tokens (where we know the storage location exactly)?
- [ ] where and how can the abstract tokens be stored? 
- [ ] how can you tell when you need to retrieve a concrete token and when you need to retrieve an abstract token?
- [ ] how could element-wise abstract tokens be stored for aggregate types? (future work?)
- [ ] make a plan how the abstract token of a pointer can be retrieved
- [ ] perhaps implement `get_load_token` which retrieves the token corresposponding to the target of a `load` instruction (could be a concrete or abstract token)
- [ ] implement `update_dependencies(line: Line, deps: Deps): Deps`
- [ ] optional: implement function to verify static single assignment, and run that function in unit tests before computing the dependencies
- [ ] copy and adapt the code for control flow graph construction
- [ ] define the lattice or state for the worklist algorithm to create the dependency graph
- [ ] copy and adapt the worklist algorithm from lab 23
- [ ] test-cases for each instruction

## Findings
<!-- What did I learn? -->

- Declaring the Scope of the function result may be problematic unless the caller is allowed to relax that constraint a bit. A function may return a local, but the caller might know or decide that it actually has some other scope. This is especially important for nested function calls. Is there covariant/contravariant typing involved here?
- having a massive tuples for the Token and Type is difficult to write and read, structured types may be a much better option

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- [ ] add construction and destruction of aggregates to the DSL
- [ ] Replace massive Token and Type tuples with structured types, i.e. `["caller", ["borrowed", "int"]]` which allows only tacking on those non-default properties you want. Carefully consider what the defaults should be. Are there any reasons to choose the top or bottom of the attribute Lattices as the default, or can you just pick the most common case, i.e. (local, clonable, no_drop) to be the default?
- [ ] Can token operations be modelled explicitly in a DSL? This may allow expressing high-level constructs with a smaller number of primitives and may simplify the analysis, at the cost of complicating the lowering pass slightly
- [ ] add `update` with similar/identical lifetime and ownership semantics as `move`
- [ ] add an owning heap-pointer type
- [ ] add global/heap scope for heap-allocated data
- [ ] investigate the pointer analysis to resolve the dependencies of `x = load a` more precisely if `a` is a local

---
**Copyright (c) 2026 Marco Nikander**
