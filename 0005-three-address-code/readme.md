# Question
<!-- What am I figuring out? -->

How can an **evaluator for 3-address code** be implemented?

Date: 2025-10-25

## Resources
<!-- Where can I find relevant information? -->

- Introduction to Compilers, Thain
    - Chapter 8: Intermediate Representations
    - Chapter 10: Assembly Language
    - Chapter 11: Code Generation
- Compilers: Principles, Techniques, and Tools, Aho et al
    - Chapter 6: Intermediate-Code Generation

## Plan
<!-- What do I want to do? -->

- Typescript prototype a small set of operations
- implement call stack and program counter
- No parser, input directly via Typescript objects


### Instruction set

| Constants and Addition |
| --- |
| load constant |
| add |
| exit / return |

| Control flow and functions |
| --- |
| label |
| jump |
| branch |
| lambda / closure |
| call |
| return |

| Possible later additions |
| --- |
| further arithmetic and logical operations |
| heap alloc, free, load, store |
| scope begin, end |
| tail call |

## Hypothesis
<!-- What do I think is going to happen? -->

Basic operations will probably be quite easy.
Call, return, lambda/closure will probably be a lot more tricky to implement.
Especially for environments, there will probably be a lot of design decisions to make.

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- implemented `Add`, `Const`, and `Exit` instructions
- wrote a few unit tests
- used ts-pattern package, but had a hard time stepping through the code with a debugger
- fixed several bugs
- implemented control flow via switch-case instead of match
- used type assertion functions to simplify error reporting
- implemented `Label` and `Jump` without any issues, use a linear search to find the jump target label (simple but slow)
- implemented conditional `Branch` without any issues
- implemented `Copy` i.e. 'mov'
- added stack frames and implemented `Function`, `Call`, and `Return`

## Findings
<!-- What did I learn? -->

### Pattern-Matching can be tricky to use

Not all of the instructions have a target register, for example `call`, `jump`, `scope begin`, `exit`.
This means an assignment such as `register[target] = match ...` is not an option.
To do this purely functionally, the entire program state, consisting of the program counter and stack, would have to be assigned via the `match`.

Another note: stepping through the code with a debugger does not seem to work very well.
The entire match expression is one expression, so the debugger does not step through the individual clauses.
Maybe there is a way to do this and I just don't know how, yet.

A switch-case is more tedious to write, does not have exhaustiveness checking, but it plays nice with mutable state and the debugger.

### Input TypeScript objects directly to avoid parsing
I can avoid the need to tokenize and parse the code by representing it directly as TypeScript objects.
That saves a tremendous amount of work and code complexity.
I did the same with the very first interpreter/transpiler prototypes I worked on.

### Object or Tuple Representation
There are two really good options for representing the 3-address code: an object or as tuple.
Both options are type-safe and provide auto-completion and tool-tips in the IDE.

```typescript
type Add = { tag: 'Add', target: Register, left: Register, right: Register };
type Add = ['Add', Register, Register, Register];

// where:
type Register = number;
```
Both options can be used in union types, to make use of type-safety in the codebase.
Objects are more verbose, but also safer to use because they are less prone to typos.
Tuples are far more compact.
Helper functions can be used to make the access to tuple-based implementations more explicit.
That would reduce odds of subtle bugs through incorrect indices / typos.
```typescript
function    tag(line: Instruction) { return line[0]; }
function target(line: Instruction) { return line[1]; }
function   left(line: Instruction) { return line[2]; }
function  right(line: Instruction) { return line[3]; }
```

Example usage, to implement addition, which returns a tagged 'Value':
```typescript
type Value = { tag: 'Value', value: boolean | number };

frame.register[line.target]  = { tag: 'Value', value: line.left.value     + line.right.value };      // objects
frame.register[line[1]]      = { tag: 'Value', value: line[2].value       + line[3].value };         // tuples
frame.register[target(line)] = { tag: 'Value', value: left(line).value    + right(line).value };     // tuples with helper functions
frame.register[target(line)] = { tag: 'Value', value: valueOf(left(line)) + valueOf(right(line)) };  // tuples with more helper functions
```
During the writing of the tuple example, several mistakes/typos were made.
That alone illustrates just how error-prone the index-based approach is, so the 1st, 3rd, or 4th option are much better choices.

Hybrid options are also possible, but they are quite verbose to use, and may have an incosistent style, so it's better to commit to one or the other.
```typescript
type Add = [ {tag: 'Add'}, Register, Register, Register];
```

Another possiblity could be to input the code in the array representation, and then translate it directly to the object notation for analysis and evaluation.
That's a straight-forward 1:1 translation which is easy to implement.

Overall, it's probably easiest to just use the TypeScript objects.
Even if it comes at the expense of some verbosity, it does introduce a lot of clarity, is simple to use, and does not require any extra functions.
It the more compact representation is desired, then inputing arrays and doing the 1:1 translation to objects, is a good option.
Either way, analysis and evaluation will work on the object-based representation of 3-address code.

### Many ways to implement Function, Call, and Return

There are huge number of ways in which a call stack can be designed, from assembly-style calling conventions to stack frames as objects.
This implementation outlines just one possibility for stack frames as objects.
Getting an initial implementation working proved tricky.

### Type Assertions are extremely useful

Sometimes we know that a type can be narrowed, based off of knowledge which is not directly encoded in the type system.
In such cases, _asserting_ that a type can be narrowed, can be extremely useful for keeping TypeScript code compact and simple.
For example:

```typescript
export function assert_defined<T> (value: undefined | T): T {
    if (value === undefined) {
        throw Error('Expected a defined value');
    }
    else {
        return value;
    }
}
```
For some use-cases, this can be much simpler than using type-guards.

### Exiting vs. Returning

Is the exit at the end of the program, really the same thing as a normal function return?
Inside the interpreter, there is not really a specific register into which the result can be written.
<!-- TOOD: elaborate on a possible dummy frame for the final return, a special exit command, or special evaluation logic for the root frame -->

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- Create a repository dedicated to 3-address code
- Create a function for write-access to registers, which enforces that each register is only assigned to once (single assignment).
- Add a validate pass which ensures that each label is unique.
- Jump uses a linear search through all instructions, to find a label. That is simple but slow if used repeatedly. Performance could be improved by resolving all jump targets to fixed instruction numbers once, before evaluation.
- Check arity when calling a function
- Validate the 3-address code for validity, i.e. no inline function definitions
- Closures
- Heap memory (alloc, free, load, store)
- Pointers to stack and heap memory

---
**Copyright (c) 2025 Marco Nikander**
