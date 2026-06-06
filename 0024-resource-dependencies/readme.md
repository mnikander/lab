# Question and Hypothesis
<!-- What am I figuring out? -->

1. How can resource dependencies be defined and computed?
2. Where are resources created and destroyed?

Date:   2026-05-28
Status: Doing

## Resources
<!-- Where can I find relevant information? -->

- lab 23

## Hypothesis
<!-- What do I think is going to happen? -->

I think the resource declaration can be written at the parameter / local slot declarations.
I think the resource itself undergoes various states, such as undefined, defined, dropped, and several others.

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Terminology

### Resource

A _resource_ is a location in memory, such as a local variable `x`.
Resources can be:
- _concrete_: a memory location which is within the scope of the function, which we can reason about precisely, for example a local variable
- _abstract_: a memory location which exists somewhere outside of the function, about which we only have type information

If we pass a pointer as an argument to a function, then the pointer itself is a concrete resource, a copy of it is stored locally after all.
Whatever that pointer argument is pointing at, lies outside of the function, and that is an _abstract_ resource, since we don't know where it is.
In theory, some information about abstract resources could be recovered via whole-program analysis.
Analysis will only be done up the the function boundary, however.
This keeps the analysis and the semantics fast and simple, but with some loss of precision.
What we do know about an abstract resource, is its full type, and for aggregate types, the full type of every component of the aggregate.
The qualifiers contain all of the essential information necessary to check ownership and lifetime constraints.

### Resource Type

Each resource has a Type, consisting of several qualifiers and an unqualified type such as `int` or `borrow int`.
The possible qualifiers are:

| Qualifier   | Possible values      |
| :--         | :--                  | 
| Scope       | {inner, outer}       |
| Duplication | {unique, clonable}   |
| Cleanup     | {must_drop, no_drop} |

A _linear_ resource can be modelled by adding the two qualifiers `unique` and `must_drop`.

### Local, Param, Slot

| Term  | Description      |
| :--   | :--                  | 
| param | A parameter of a function, the value is passed in from the outside |
| local | A resource defined inside a function |
| slot  | A `param` or a `local`, i.e. something within the function, not outside the function |

Note that all slots are numbered.
The params come first, followed by the locals.
For example, a function which takes 2 parameters and has 3 local variables, has:
- the parameters in slots 0 and 1
- the local variables in slots 2, 3, and 4

### Path

A path is a description of how to access a particular resource.
It could be just a slot number, which gives a `param` or `local`.
It could also be a field access in an aggregate type or derefencing of a pointer.
For example, if slot 1 is a pointer, we could also have a path `deref 1` which means "take resource 1, dereference it, and _that_ is the resource we are talking about".

### Resource Dependencies

For a given resource, the _resource dependencies_ is the set of other resources which it depends on.
For an integer resource, this set it empty, it's just a basic value.
For a pointer-type resource, it is the set of resources which that pointer may point at.

### Resource State

The _resource state_ is the state of a particular resource at a particular location in the code.
The state of a resource can be _undefined_, _defined_, _moved_, _dropped_, _escaped_, or _ambiguous_.
A dataflow analysis verifies all operations which are done with resources are allowed for the current resource state.
For example, a resource which is _defined_ can be accessed.
Accessing a resource which is _undefined_, _dropped_, or _ambiguous_ is an error.

## Operations and Dependencies on Resources

| Operation         | Dependencies                                 | Comments |
| :--               | :--                                          | :--      |
| `x = phi a b ...` | `deps x = union (deps a) (deps b) ...`       | |
| `x = constant`    | `deps x = empty`                             | |
| `x = add a b`     | `deps x = empty`                             | `add` is a stand-in for all arithmetic and logical ops |
| `x = copy a`      | `deps x = deps a`                            | |
| `x = move a`      | `deps x = deps a`                            | |
| `x = own a`       | `deps x = union a (deps a)`                  | Does this work correctly if `a` is a pointer or primitive? |
| `x = borrow a`    | `deps x = union a (deps a)`                  | Does this work correctly if `a` is a pointer or primitive? |
| `x = load a`      | `deps x = union (deps a_i)` for all `a_i` in `(deps a)` | |
| `x = call a b ...`| `deps x = union (deps outer_or_global_args)` | See notes below. |
| `x = drop`        | no change                                    | Drop ends the lifetime, dependencies unchanged |
| `branch x [L R]`  | no change                                    | |
| `return x`        | no change                                    | `x` is moved out, all param and local lifetimes end, dependencies unchanged |

### Load

If `a` is a pointer to a primitive type, then `deps a` is empty, and thus `deps x` must also be empty.
If, for example, `a` is a `borrow int` then we can treat the `load a` like `copy` of an `int`.

If `a` is a local variable and a pointer to a pointer, we can compute the points-to-set accurately.
If `a` is an argument which was passsed into the function and a pointer to a pointer, it points at something which lies outside of the function, i.e. an abstract resource.

### Call

The dependency set of a function result is decided by the parameters.
All parameters which the function signature declares as `outer` or `global` scope, may flow into the result.
For a function call `x = call a b ...` we must check which arguments are passed into parameter slots marked as `outer` or `global`.
We retrieve the dependencies of each of those arguments, and compute the union of those dependencies.
That is the dependency set of the result, i.e. `deps x`.

## Plan and Implementation
<!-- What did I do? -->

- [x] define Basic and Pointer types -- trivial placeholders may be enough for the DSL
- [x] define the resource type
- [x] does it make sense to model the resource type as a single tuple, or should they be attributes which are composed onto the Type, i.e. `(unique (inner (ptr int)))`? That would make defaulting easier, and makes is easier to implement the attributes one at a time. -- I'll keep the explicit tuple formulation for now, so the resource type is concrete in the code
- [x] define an IR-like grammar which models define, use, copy, move, ~~update~~, drop, own, borrow
- [x] merge Type information into resource type
- [x] refactor test-cases to build resource types algebraically, using functions, to make the code more readable
- [x] create a few test-cases with examples
- [x] document a table of operations and their impact on dependencies
- [x] ~~implement `compute_types` which takes a Function and computes its set of resources from the params and allocas~~ -- the resource types are all right there in the IR code
- [x] ~~extend `compute_types` so that the abstract resources (targets of pointer-valued arguments) are created as well~~ -- the abstract resources are in the pointer type
- [x] ~~where and how can the abstract resources be stored?~~ -- they are already in the source code
- [x] ~~how can you tell when you need to retrieve a concrete resource and when you need to retrieve an abstract resource?~~ -- just look at the pointer and for now, just treat it as an abstract resource every time, even for locals, to keep things simple
- [x] ~~how could element-wise abstract resources be stored for aggregate types? (future work?)~~ -- they are already in the type
- [x] ~~make a plan how the abstract resource of a pointer can be retrieved~~
- [x] ~~perhaps implement `get_load_resource` which retrieves the resource corresposponding to the target of a `load` instruction (could be a concrete or abstract resource)~~
- [x] define/refine a type to encode dependencies, keep it simple
- [x] do I need to differentiate abstract resources (unknown location outside the function) from concrete resources (where we know the storage location exactly)? I probably need a way to address into them, so that I can retrieve them from the source code
- [x] copy the code for control flow graph construction (tweak types if necessary)
- [x] copy and adapt the worklist algorithm from lab 23
- [x] check what the update function for the worklist algorithm expects
- [x] use the table in this readme to implement `update_dependencies(line: Line, deps: Deps): Deps`
- [x] update the readme to use the new terminology of "Resource", "Resource Dependencies", and "Resource State"
- [x] update the types and code to use the "Resource" terminology
- [x] rename registers to resources
- [x] rename scopes to {inner, outer} so that `alloca` can be replaced by `local`
- [x] rename `alloca` to `local`
- [x] is there a way to simplify the reasoning about the dependencies and the CFG? -- yes, use better names such as `Path`
- [ ] can I make the update function here, compatible with the worklist algorithm?
- [ ] should I use the worklist algorithm as is, or modify it to operate on code lines directly?
- [ ] define the lattice or state for the worklist algorithm to create the dependency graph. Is the lattice just the dependencies from each resource to other resources?
- [ ] write test-cases for functions which actually take arguments
- [ ] where do I handle phi-nodes? at the instruction level, or in the `join` of the worklist algorithm? I think the table of instructions mixes concerns -- or the existing iterative fixed-point solver is not the right tool for this job
- [ ] use worklist algorithm to iterate over the CFG and compute the dependencies
- [ ] **phi nodes need to be able consume their resources**, for linear semantics -- add this to the grammar and add a loop-test case which does this
- [ ] test-cases for each instruction
- [ ] optional: implement function to verify static single assignment, and run that function in unit tests before computing the dependencies

## Findings
<!-- What did I learn? -->

- Declaring the Scope of the function result may be problematic unless the caller is allowed to relax that constraint a bit. A function may return an outer-scope resource, but the caller might know or decide that it actually has some other scope. This is especially important for nested function calls. Is there covariant/contravariant typing involved here?
- having a massive tuples for the resource type is difficult to write and read, structured types may be a much better option
- just as in the last dataflow analysis, it got difficult to reason about the code when there are in/out-sets which themselves are effectively sets of sets

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- [ ] add construction and destruction of aggregates to the DSL
- [ ] Replace massive resource type tuples with structured types, i.e. `["outer", ["borrowed", "int"]]` which allows only tacking on those non-default properties you want. Carefully consider what the defaults should be. Are there any reasons to choose the top or bottom of the attribute Lattices as the default, or can you just pick the most common case, i.e. (inner, clonable, no_drop) to be the default?
- [ ] Can resource operations be modelled explicitly in a DSL? This may allow expressing high-level constructs with a smaller number of primitives and may simplify the analysis, at the cost of complicating the lowering pass slightly
- [ ] add `update` with similar/identical lifetime and ownership semantics as `move`
- [ ] add an owning heap-pointer type
- [ ] add global/heap scope for heap-allocated data
- [ ] investigate the pointer analysis to resolve the dependencies of `x = load a` more precisely if `a` is in the inner scope

---
**Copyright (c) 2026 Marco Nikander**
