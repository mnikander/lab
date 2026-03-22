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
- [ ] write test-cases for type-checking
- [ ] implement a simple type-checker
- [ ] optional: extend arrows to n-ary functions, perhaps with `type Arrow  = { type: "Arrow", from: Type[], to: Type[] };`
- [ ] can type-deduction be done for generic functions?
- [ ] define sum and product types
- [ ] optional: define order relation on types (useful for casting Int8 to Int16 for example)

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

## Findings
<!-- What did I learn? -->

It would be possible to encode the arrows in a very compact form using javascript arrays. `Int64 -> Int64 -> Int64` could be encoded as `[["Int64", "Int64"], "Bool"]`. However, this would make it impossible to distinguish Other things taking multiple arguments, such as sum and product types, from arrows.
So it might be better to write everything out as javascript objects.
That said, I could include a small tag at the start, and then still just use arrays.
I could write: `["->", "Int64", ["->", "Int64", "Bool"]]`.
This might allow writing a generic algorithm to flatten the whole structure in various orders, regardless of what sort of types are used inside.
Static array types might still be an issue, with `["Array", "Int64", 20]`, since the '20' is not a type argument.
I might have to handle that array type separately.



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
