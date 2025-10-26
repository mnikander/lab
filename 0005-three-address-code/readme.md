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

|Initial set |
| --- |
| load constant |
| add, mul |
| exit / return |

| Possible later additions |
| --- |
| label |
| jump |
| conditional jump |
| further arithmetic and logical operations |
| lambda / closure |
| call |
| return |
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

Open questions / notes regarding `match`: 
Perhaps match doesn't work with side-effects, and I really should use returns, and assign the match result to the return register.
If I do that, then I need a way to encode the special case of exit, i.e. when there is no parent stack frame, where the result can be written.
Maybe I need to figure out a special type to encode the program return value as a destination, which is not a register.
Or I need a special entry frame, to which the result is written, but where the evaluator does nothing except take the result value and return it.

## Findings
<!-- What did I learn? -->

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
That illustrated just how error-prone the index-based approach is, so the 1st, 3rd, or 4th option are much better choices.

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

### Exiting vs. Returning

Is the exit at the end of the program, really the same thing as a normal function return?
Inside the interpreter, there is not really a specific register into which the result can be written.
<!-- TOOD: elaborate on a possible dummy frame for the final return, a special exit command, or special evaluation logic for the root frame -->

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- create a function for write-access to registers, which enforces that each register is only assigned to once (single assignment)

---
**Copyright (c) 2025 Marco Nikander**
