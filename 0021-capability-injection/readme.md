# Question
<!-- What am I figuring out? -->

How can a side-effect capabilities be injected into modules?

Date:   2026-05-13
Status: Done

## Resources
<!-- Where can I find relevant information? -->



## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

### Idea
A programming language could be built in such a way that side-effects are forbidden in general.
The code in every module written in the language, does not have the ability to perform side-effects on its own.
When a module is imported, dependency injection is used to give the module the **Capability** to do a particular side-effect.

A Capability is just an object which has several functions, and these functions are the side-effects we want to use, for example "print to the console" or "read data from a file".
Only the main function has the ability to instantiate capabilities out of thin air.
All other modules can only use the capabilities which they were given.
When one of those modules imports another module, it can only pass forward the Capabilities it has -- or more restricted versions of those capabilities.
So main might import a `module A` and give it FileIO and HTTP capabilities.
`Module A`, in turn, might import `Module X` to which it gives File-IO to a particular directory and it may import a `Module Y` to which it gives HTTP access.

Overall, such a system forms a tree of capabilities which are passed down, i.e. injected into, respective modules via the import statements.
If a module tries to use a Capability which it was not given, for example Network access when it was only granted File-IO, then that's compile-time error.
The Capability type which it was given does not contain that Network Capability Type.

This is a permission system for modules, which controls which modules are allowed to do which side-effects.
Dependency injection is a very explicit notation and relatively simple to implement, but its use may become cumbersome at scale.
It may be possible to refactor the code a bit so that a 'module' is like a ReaderT monad from Haskell, which provides some syntactic sugar for the access to the environment, i.e. injected capabilities.

In this prototype, the `import` of such a restricted module, is implemented via a function call.
You pass the function the Capabilities, and you receive a 'module object' which has the functions it exports.

### Prototyping steps
- [x] define a log capability
- [x] define a second capability like file read or state
- [x] create a "restricted module object" and a constructor for it
- [x] ~~write a positive and negative test case~~ create a main function
- [x] confirm that the negative case fails type checking

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno main.ts
```

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined capabilities, example modules, and main file
- tried creating generic functions but struggled and went for simpler examples instead
- split things into separate files for clarity

## Findings
<!-- What did I learn? -->

- supporting generic functions is tricky
- it's not clear how types can be exported from a module

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- Can such 'restricted modules' export _generic_ functions?
- Can such 'restricted modules' export types at all if they are implemented via objects?
- How type-safe is this? What mechnisms can a module use to increase its own permissions?
- Const-correctness is a bit tricky in JS/TS. How can directory access and other capabilities be restricted in a safe way, at runtime? Can those capability objects be made immutable in a way which is _secure_?
- How can monotone restriction of capabilities be implemented, i.e. that capabilities can be narrowed in submodules?
- Which side-effects does a general purpose language need?
- What is a good mapping of side-effects to capability interfaces? Should any be grouped together?

---
**Copyright (c) 2026 Marco Nikander**
