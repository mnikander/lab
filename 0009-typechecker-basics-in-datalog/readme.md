# Questions
<!-- What am I figuring out? -->

1. How can a basic type-checker be implemented in Datalog?
2. How can multi-argument functions be type-checked using Datalog? |
3. Can type-errors be found using monotic logic, without stratified negation? |

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

### 1. The First Attempt: Do it all in one go.

I tried to represent the following program in Datalog directly:
```
foo :: green -> green
bar :: red   -> green -> blue
let r: red   = empty
let g: green = empty
let b: blue  = empty
let i: green = (foo g)
let j: blue  = (foo g)  % error
let k: green = (bar r g)
let l: green -> blue = (bar r)
```

This raised a lot of questions:
- Could I create curried function definitions, and basically just do simply-typed unary lambda calculus as my first example?
- How do I encode nested lambdas?
- How do I encode return types?
- How do I chain the function type signature to be something like `unit -> unit -> unit`?
- Does it make more sense to use several types, to check that it's working correctly?
- Do I have to give the intermediate lambdas a name, to be able to chain them in Datalog?
- Should I use cons-cells to encode function calls, argument lists, and other information? Or should I use a dedicated relation for each one?

### 2. The Second Attempt: Start simple and take it slow.

Defined two types manually, to have something concrete to work with:
```
i1 = {0, 1}
i4 = {0, 1, 2, 3, 4, 5, 6, 7}
```
Started work on the type checker with a simple let-binding:
```
let a: i1 = 0  % ok
let b: i1 = 1  % ok
let c: i1 = 2  % type-error
```

Since Racket-Datalog does not have stratified negation, the approach must be chosen accordingly.
Apparently, the usual solution is to formulate the type-checker as something that finds errors.
That already raises the first question: without negation, how can we possibly discover that the value `2` is _not_ in the set `{0, 1}`?
We may actually (1) have to find the valid definitions instead, or (2) provide predicates such as `not_i1(X)` which include the negation in a hard-coded way.
Decided to try approach 1, and search for the correctly typed terms, since it scales better if more types are added in the future.

#### Representing Types and Let-Bindings (initial)

Tried introducing type-predicates and let-bindings of the form:
```
i1(0). i1(1).
i4(0). i4(1). i4(2). i4(3). i4(4). i4(5). i4(6). i4(7).

let(0, a, i1, 0).    % ok
let(1, b, i1, 1).    % ok
let(2, c, i1, 2).    % error
```
Where `let` has the form `let(line, name, type, value)`.
This caused two problems though:
1. there is a naming conflict between the predicate `i1` and the type name `i1`
2. there is no way to get from the type name to the predicate to actually do type-checking

So the type predicates were revised to: 
```
in(0, i1). in(1, i1).
in(0, i4). in(1, i4). in(2, i4). in(3, i4). in(4, i4). in(5, i4). in(6, i4). in(7, i4).
```
To check them, the following relation was introduced:
```
check(L) :- let(L, N, T, V), in(V, T).
```
L is the line number, N is the name, T is the type, and V is the Value.
For this to hold, there must be a relation `let` for a given line number, and the type and value of that let-binding must satisfy the relation `in`.
Querying with: `check(L)?` produced the following output:
```
check(0).
check(1).
```
Notably, line #2 `let z: i1 = 2`, which has a type error, is not on this list. 
So far so good. :)

#### Expressions on the Right-Hand Side

If the right-hand side is a constant, it's easy to encode the entire line in a single relation for the let-binding.
The left-hand side and the right-hand side can also be split into separate relations, however.
Such a split is useful, to allow variables or function calls with multible arguments.

After introducing a new relation `constant` with two arguments (line number L and constant value V), the code looks like this:
```
check(L) :- let(L, N, T), constant(L, V), in(T, V).

let(0, a, i1).
constant(0, 0).    % ok

let(1, b, i1). 
constant(1, 1).    % ok

let(2, c, i1). 
constant(2, 2).    % error
```

Multiple Datalog statements can be placed in the same line. The '.' matters, not the linebreak, so the above can be written as:
```
let(0, a, i1). constant(0, 0).    % ok
let(1, b, i1). constant(1, 1).    % ok
let(2, c, i1). constant(2, 2).    % error
```
It doesn't look great, but we can make out the original syntax if we squint at it long enough.
Querying the updated code with `check(L)?` gives the same result as before.

#### Variable Lookup (initial)

Given the following code:
```
let d: i4 = 5    % ok
let e: i4 = d    % ok
let f: i1 = d    % error: trying to assign an i4 into an i1
let g: i1 = c    % error: trying to assign from a variable which has an error
```
This initially prompted the creation of the following rule:
```
check(L) :- let(L, N, T), constant(L, V), in(T, V).
check(L) :- let(L, N, T), variable(L, N_other), let(L_other, N_other, T), check(L_other), L != L_other, N != N_other.
```
Which verifies that:
1. there is a let-binding on the left of the line
2. a variable access on the right side of the line
3. the variable on the right-hand side has a let-binding somewhere
4. the variable on the right-hand side can be typed correctly
5. the two variables are not actually the same variable

### 3. Rewrite the Rules for Unary Function Calls

Here are several examples of a unary function call, using logical 'not', which need to be type-checked:
```
let h: i1 = not 0    % ok
let i: i1 = not a    % ok
let j: i1 = not 5    % error: 'not' expects an i1
let k: i1 = not d    % error: 'not' expects an i1
let l: i1 = not c    % error: trying to assign from a variable which has an error
let m: i4 = not 0    % error: trying to assign an i1 into an i4
```
Unfortunately, allowing functions to take (1) constants and (2) variables as arguments, greatly complicates the rules unless they are rewritten from the ground up.
Here is the new set of rules:
```
% helpers
assert_constant(L, T)    :- constant(L, V), in(V, T).
assert_variable(L, N, T) :- variable(L, N), type(N, T).
assert_call(L, T)        :- call(L, F), signature(F, T_other, T), assert_arg(L, V, T_other).
assert_arg(L, V, T)      :- arg(L, V), in(V, T).
assert_arg(L, N, T)      :- arg(L, N), type(N, T).

% relations
type(N, T)               :- let(L, N, T), assert_constant(L, T).
type(N, T)               :- let(L, N, T), assert_variable(L, N_other, T).
type(N, T)               :- let(L, N, T), assert_call(L, T).

% function signatures
signature(not, i1, i1).
```
The new set of rules has a function `type(N, T)` which enforces that the name `N` has type `T`.
To do this, it looks at the corresponding let-binding for the name `N` and then dispatches to rules which assert that the type of a constant, variable, or function call return-value is indeed `T`.
The nice thing about this approach is that the output is also much more readable.
The query `type(N, T)?` produces the following output:
```
check(d, i4).
check(b, i1).
check(a, i1).
check(e, i4).
check(h, i1).
check(i, i1).
```

### 4. Multi-Argument Functions (TODO)

- I need to find a way to encode the signatures of n-ary functions
- I need to either create a linked-list of arguments via `cons(First, Rest)`, key the arguments by position, or key the arguments by their parameter names
- I can represent functions as n-ary functions or curry them (i.e. make them nested unary functions)
- Should higher-order functions be allowed?

An `arrow(From, To)` relation could be used to encode various structures such as:
- `i4 -> i4 -> i4` which is `i4 -> (i4 -> i4)`
- `(i4 -> i4) -> i4`

### 5. Searching for Errors (TODO)

A big problem with searching for valid code, is that we don't get error messages.
Searching for invalid code, could actually report which lines were incorrect, and maybe even what the problem is.

Is it possible to take the relation:
```
type(N, T) :- let(L, N, T), assert_constant(L, T).
```
and change it to something like:
```
type_mismatch(L, N, T) :- let(L, N, T), assert_constant(L, T_other), T != T_other.
```
Something like this might allow us to find type errors, and even give us the line-number where an error occurred.

## Findings
<!-- What did I learn? -->

- The Datalog code can be reasonably similar to the actual code. That's kind of nice, because in might make it easier to write the source-to-source conversion to actually use such a type-checker.
- Searching for type-errors seems like it's impossible in positive Datalog (i.e. monotonic logic).
- Listing the terms which _can_ be typed successfully, seems to work well.
- I read somewhere that it is good design to structure the rules in layers, i.e. top level rules, helpers, and facts. This design philosophy was very helpful here.

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2025 Marco Nikander**
