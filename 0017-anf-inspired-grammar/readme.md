# Question
<!-- What am I figuring out? -->

Can an ANF-inspired grammar be relaxed to support nested expressions like Scheme?

Date:   2026-05-02
Status: Done

## Resources
<!-- Where can I find relevant information? -->

I don't know

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

- [ ] move the prototype Langium grammar into this repo
- [ ] define an AST using object types
- [ ] define an AST using tuple types
- [ ] write an example JSON for each grammar
- [ ] only check the test-case JSON for type validity, nothing else

## Running the Code
<!-- What steps are required to run the code? -->

Type-checking is the interesting part, so there is not much to run.
The tests can be compiled with:
```
deno test
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

Note that the langium grammar is essentially documentation only.
It is not directly tied to this implementation.

- implemented a block-based grammar, using JSON tuples
- it was a pretty messy and hard to read
- implemented a more relaxed grammar 
    - it does not have the control-flow in tail position restriction
    - it has much less type safety in the AST
    - it would rely much more strongly on type checks and validity checks after parsing
    - it has a much simpler syntax and is better suited for meta-programming

## Findings
<!-- What did I learn? -->

 1. Encoding a lot of structure in the AST can make it safe, but complicated.
 2. To enable meta-programming, it may be much better to opt for a simple syntax and validate / normalize it a bit more as part of compilation
 3. The syntax is quite close to Scheme, though the ML-style let-bindings decrease the number of parentheses a bit
 4. Both grammars are expression languages at the moment, there are no top-level functions, which is a bit unfortunate -- it may require extra syntax to add them
 5. Tuples are much more compact than Objects would have been
 6. A tag at position 0 allows for type-safety and dispatch
 7. The supported surface syntax is essentially the same, but the complexity of the AST is very different

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

Having a simple AST really pays dividends when you have to input it manually.
When meta-programming, that difference is probably just as pronounced.
For good meta-programming it would be really good to have an AST based on symbolic expressions or something very close to it.
It seems plausible that the syntax can be extended slightly, with special syntax for special forms such as `let` and `if` as well as function abstraction and application, to significantly decrease the number of parentheses but still retain exactly the S-expression structure.
This opens the possibility of having two closely related surface languages:
    (1) symbolic expressions
    (2) ML-like
which share a common AST. A compiler flag or marker in the script (shebang) could be used to indicate which syntax the parser should use.
If the ML-like subset is chosen cautiously, it may even be possible to define the grammar in such a way that both styles are valid syntax within the _same_ surface language.
Then a formatter could switch between the two by adding or removing parenthesis or keywords.
For the surface language, it's probably a good idea to start with S-expressions for simplicity.
It would be interesting to do some experiments to find out if the ML-style let-bindings, if-conditionals, function definitions, and function calls fit into the grammar as extensions.
Ideally, the special syntax for the special forms would fit into the grammar in such a way every symbolic expression is still a permissible subset of the language, so the parser can still parse _all_ symbolic expressions.
The special forms would probably get both a S-expression and a built-in syntax-sugar version in the language.

- try out S-expressions again
- search for my old S-expression parser, or implement a new one
- try to extend a symbolic expression grammar with special syntax for `let`, `if`, as well as function abstraction and application

---
**Copyright (c) 2026 Marco Nikander**
