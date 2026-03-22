# Question
<!-- What am I figuring out? -->

How can a simple system be defined and checked?

Date:   2026-03-21
Status: In progress

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [x] define elementary types
- [x] define unary arrow types (functions)
- [x] define equivalence relation on types
- [x] write test-cases for type-checking
- [x] implement a simple type-checker
- [x] optional: extend arrows to n-ary functions, ~~perhaps with `type Arrow  = { type: "Arrow", from: Type[], to: Type[] };`~~
- [x] define sum and product types
- [x] static array types
- [ ] optional: dynamic array types
- [ ] optional: pointer types
- [ ] optional: how do you parse IR code to get the required information for type-checking?
- [ ] optional: define order relation on types (may be useful for casting Int8 to Int16 for example)
- [ ] optional: can type-deduction be done for generic functions?

One way to implement the checking of function arguments, is to flatten the tree structure created by nested arrows, with an in-order traversal.
After that, you can compare the resulting list against the argument list.

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined Top, Bottom, Unit, Bool, Char8, and Int64 to have a small assortment of types available
- defined equivalence relation
- defined Arrow type and extended the equivalence relation accordingly
- tested nested arrow types
- implemented check for assignment (it's just the equivalence function)
- started implementing check for function application
- simplified types to use tuples
- wrote function to flatten arrow types to an in-order list, which can be compared against the argument list
- modified the function which flattens arrow types, to _not_ flatten left arguments, which adds support for higher-order functions
- implemented fixed-size array type

## Findings
<!-- What did I learn? -->

It is possible to encode the arrows in a very compact form using JavaScript arrays.
A compact tuple-based encoding of `Int64 -> Int64 -> Int64` is `["Int64", ["Int64", "Bool"]]`. 
In such an encoding, it is not possible to distinguish aggregate types, such as sum and product types, from arrows.
Inserting a tag at the start of the array, resolves this ambiguity.
The resulting notation is: `["Arrow", "Int64", ["Arrow", "Int64", "Bool"]]`.
That is still much more compact than JS objects would be.

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
