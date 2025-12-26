# Question
<!-- What am I figuring out? -->

How can a basic type-checker be implemented in Datalog?

Date: 2025-12-26

## Resources
<!-- Where can I find relevant information? -->

- [Racket Datalog tutorial](https://docs.racket-lang.org/datalog/Tutorial.html)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- create a Racket-Datalog file and define a relation for a variable binding
- design a type-system with (1) a unit type for all values and (2) an arrow type for functions
- design a representation in Datalog for (1) variable definitions, (2) function definitions, (3) function calls
- think about whether it makes sense to encode a basic block, which contains the above instructions, as a graph in Datalog, or whether you do all the CFG processing outside and only input the facts into Datalog

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

### 1st Attempt: Model a Small Program in Datalog

I tried to represent the following program in Datalog directly:
```
foo :: green -> green
let r: red   = empty
let g: green = empty
let b: blue  = empty
let i: green = (foo g)
let j: blue  = (foo g)  % error
```

This raised a lot of questions:

Could I create curried function definitions, and basically just do simply-typed unary lambda calculus as my first example?
How do I encode nested lambdas?
How do I encode return types?
How do I chain the function type signature to be something like `unit -> unit -> unit`?
Do I have to give the intermediate lambdas a name, to be able to chain them in Datalog?

To check that the type-checking is actually working, it might be better to have 2-3 types available.
For example, the types could be `red`, `green`, `blue` and functions thereof.

Should I use cons-cells to encode function calls, argument lists, and other information?
Or should I use a dedicated relation for each one?

### 2nd Attempt: Start Simple, Take it Slow

We are going to define some types manually, so that we have something concrete to work with.

```
i1 = {0, 1}
i4 = {0, 1, 2, 3, 4, 5, 6, 7}
```

Later on, we could try adding a type for natural numbers, defined inductively.
That means we have a zero-element and a successor function, so the number 3 is encoded as `successor(successor(successor(zero)))`.
For now, we are going to stick to `i1` (typically called 'boolean') and `i4`.
For type-checking, let's start with a simple let-binding.

```
let a: i1 = 0  % ok
let b: i1 = 1  % ok
let c: i1 = 2  % type-error
```

Since we are using monotonic logic, do not have access to negation, stratified or otherwise, we need to formulate our problem accordingly.
Apparently, the usual solution is to formulate the type-checker as something that finds errors.
That already raises the first question: without negation, how can we possibly discover that the value `2` is _not_ in the set `{0, 1}`?
We may actually (1) have to find the valid definitions instead, or (2) provide predicates such as `not_i1(X)` which include the negation in a hard-coded way.
Let's try approach 1, since it scales better if we add further types in the future.
So, we are searching for correctly typed statements.

We manually define type-precicates:
```
% definition of what is in type i1, i.e. booleans
i1(0).
i1(1).

% definition of what is in type i4
i4(0).
i4(1).
i4(2).
i4(3).
i4(4).
i4(5).
i4(6).
i4(7).
```
#### How do we represent a let-binding?
We want to include the following information: 
- line number
- variable name
- variable type
- value

We can do this with a relation of the Form:
```
let(line, name, type, value)
```

If we write `let(0, a, i1, 0).` we immediately run into two problems, however.
(1) we have a naming conflict between the predicate `i1` which we defined earlier and the type name `i1` which we want to use in this let-binding.
(2) we have no way to get from the type name to the predicate to actually do any checking

This means we need to change how we define the types.
Let's change them to:
```
in(i1, 0).
in(i1, 1).
in(i4, 0).
```
... and so on.
That gives us a relation between the typename and the value.

Now how do we check our let-bindings for correctness?
```
let(0, a, i1, 0).    % ok
let(1, b, i1, 1).    % ok
let(2, c, i1, 2).    % error
```

To check them, we introduce the following relation:
```
check(L) :- let(L, N, T, V), in(T, V).
```
L is the line number, N is the name, T is the type, and V is the Value.
For this to hold, there must be a relation `let` for a given line number, and the type and value of that let-binding must satisfy the relation `in`.
We can query our new relation with:
```
check(L)?
```
Which produces the following output:
```
check(0).
check(1).
```
Notably, line #2 `let z: i1 = 2`, which has a type error, is not on this list. 
So far so good. :)

#### How do we allow expressions on the right-hand side?

Suppose we want to call a function, and store the result in a variable.
Let's start with logical function `not`, with the signature `i1 -> i1`.
In other words, it takes a boolean and returns a boolean.
```
let x: i1 = not 0    % ok
let y: i1 = not 2    % error
```
How do we encode that?
It doesn't fit into the schema we defined for our let-binding.
If we wanted to encode the whole thing in the let-binding, we would have to add extra positions for the arguments.
If functions can have any number of arguments, this becomes untenable.
One solution for this is to split the left-hand side and the right-hand side into two separate relations, so that we gain flexibility.
We introduce a new relation `constant` with two arguments:
1. a line-number L, for which it is the right-hand side
2. the constant value it represents

Our code now looks like this:
```
% relations
check(L) :- let(L, N, T), constant(L, V), in(T, V).

% expressions

let(0, a, i1).
constant(0, 0).    % ok

let(1, b, i1). 
constant(1, 1).    % ok

let(2, c, i1). 
constant(2, 2).    % error
```

We can also omit several newlines and write it as:
```
let(0, a, i1). constant(0, 0).    % ok
let(1, b, i1). constant(1, 1).    % ok
let(2, c, i1). constant(2, 2).    % error
```
It doesn't look great, but we can make out the original syntax if we squint at it long enough.
Querying the updated code with `check(L)?` gives the same result as before.

#### How do we look up a variable?

Before we get into functions, and passing arguments into functions, we need to be able to type-check variable lookups.
Suppose we have the following code:
```
let d: i4 = 5    % ok
let e: i4 = d    % ok
let f: i1 = d    % error: trying to assign an i4 into an i1
```

We need a way to retrieve the type information of a variable which appears on the right-hand side.
For this, we can add a new type-checking rule:
```
check(L) :- let(L, N, T), variable(L, N_other), let(L_other, N_other, T), L != L_other, N != N_other.
```
This verifies that:
1. there is a let-binding on the left of the line
2. a variable access on the right side of the line
3. the variable on the right side has a let-binding somewhere
4. the two variables are not actually one and the same

The query `check(L)?` produces the output:
```
check(3).
check(1).
check(0).
check(4).
```
So every line except lines #2 and #5 type-check, which is what we expect.

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
