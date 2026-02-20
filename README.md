# Questions

Can reading, coding, and note-taking be combined to learn quickly and in a lasting way?
This repo is a place to ask questions, read, experiment, and find the answers.
The tables below collect those questions.
**Open** questions are sorted by priority (highest at the top).
**Resolved** questions are sorted by their resolution date (most recent at the top).

## Open

| Num  | Parent | Created    | Tags                 | Question |
| ---  | ---    | ---        | ---                  | ---      |
| 0014 |        | 2026-02-20 | ssa, graphs          | How can an iterative fixed-point solver compute the availabilty of SSA variables? |
|      |        | 2026-01-04 | ssa, graphs          | How can dominance, dominator trees, and the dominance frontier be computed in a control flow graph? |
|      |        | 2026-01-04 | ssa, graphs          | How can dominance frontiers be used to check/place phi nodes? |
|      |        | 2026-01-03 | graphs, datalog      | How do you convert monotonic logic on ternary relations into a graph problem? |
|      |        | 2026-01-03 | graphs, datalog      | How can a naive or semi-naive solver for Datalog be implemented? |
|      |        | 2025-12-26 | graphs, tools        | How can CFG be translated to PlantUML or Mermaid and then visualized? |
|      |        | 2026-01-04 | graphs               | How can a cylic graph be condensed into a DAG? |
|      |        | 2026-01-04 | graphs               | How can a DAG be sorted topologically? |
|      |        | 2026-01-04 | ssa, graphs          | What is a maximal-fixed-point algorithm and why is it relevant for SSA? |
|      |        | 2025-12-30 | tools                | How can syntax-highlighting for Datalog be defined for the Monaco editor or another editor? |
|      |        | 2025-12-27 | datalog, types       | Can type-errors be found using monotonic logic, without stratified negation? |
|      |        | 2025-12-26 | types                | Can a basic type system be defined with only a unit type, reference type, and arrow type? |
|      |        | 2025-10-15 | memory, ownership    | What are move semantics really? How can move semantics be implemented? |
|      |        | 2025-10-15 | memory, ownership    | How can borrow-checking be implemented for stack-values? |
|      |        | 2025-10-15 | memory, ownership    | How can borrow-checking be implemented for heap-values? |
|      |        | 2025-10-15 | memory, ownership    | How can borrow-checking be implemented for references? |
|      |        | 2025-12-26 | ir, rust             | How do you compile a Rust program to MIR? |
|      |        | 2025-10-15 | ir, memory           | How can a stack a **pointer/reference into stack memory** be implemented? (frame number, register number, generation number?) |
|      |        | 2025-10-15 | ir, memory           | How can a stack a **pointer/reference into heap memory** be implemented? (frame number, register number, generation number?) |
|      |        | 2025-10-15 | vm, memory           | How can heap-allocation be simulated within a garbage-collected runtime environment? |
|      |        | 2025-10-15 | memory               | How can a box, i.e. a unique pointer, be implemented? |
|      |        | 2025-10-15 | typescript           | How does `match`, from the `ts-pattern` package, work? |
|      |        | 2025-10-15 | typescript           | How can the `Result` type from the `neverthrow` package be used to chain computations? |
|      |        | 2025-10-15 | racket               | How can a function and a test be written in Racket? |
|      |        | 2025-10-15 | racket               | How can an macros be used to tranform S-expressions in Racket? |
|      |        | 2025-10-15 | ast, ANF, racket     | How can nested blocks be unrolled into let-bindings in an AST which is in ANF? |
|      |        | 2025-12-26 | meta-programming     | Is it possible to do meta-programming, sort of like Lisp, but on the control flow graph instead of on the abstract syntax tree? |
|      |        | 2025-12-26 | concurrency          | Can C++ exceptions be (mis-)used to implement asynchronous functions or even an effects system? |
|      |        | 2025-12-26 | concurrency          | How can Petri nets be simulated? |
|      |        | 2025-12-26 | concurrency          | What is an inhibitor arc and how does make Petri nets Turing-complete? |
|      |        | 2025-12-26 | machine learning     | How can an extreme learning machine be implemented? |
|      |        | 2025-12-26 | machine learning     | How can a constraint extreme learning machine, with a simple constraint, be implemented using an open source quadratic solver? |
|      |        | 2026-0- | | |

## Resolved

| Num  | Parent | Created    | Tags                 | Question |
| ---  | ---    | ---        | ---                  | ---      |
| 0013 |        | 2026-01-03 | graphs               | What is a lightweight way to implement reachability on directed graphs in Typescript? |
| 0012 |        | 2026-01-02 | datalog, ssa         | How can non-dominance of CFG nodes be expressed using positive Datalog? |
| 0011 |        | 2025-12-28 | datalog, types       | Can cons-cells be used to type-check multi-argument functions using Datalog? |
|      | 0011   | 2025-12-27 | datalog, types       | How can multi-argument functions be type-checked using Datalog? |
| 0009 |        | 2025-12-22 | datalog, types       | How can a basic type-checker be implemented in Datalog? |
| 0010 |        | 2025-12-28 | datalog              | How can the equality of lists, constructed of cons-cells, be tested in Datalog? |
| 0008 |        | 2025-12-19 | datalog              | How can I solve logic problems using Datalog? |
| 0007 |        | 2025-12-18 | datalog              | How can Datalog be used to verify properties on graphs? | 
| 0006 |        | 2025-10-15 | memory               | How can cons cells be implemented? |
| 0005 |        | 2025-10-25 | vm                   | How can an **evaluator for 3-address code** be implemented? |
|      |  0005  | 2025-10-15 | vm, lowering         | ~~What is a simple set of **linear instructions** which can be used for programming?~~ |
|      |  0005  | 2025-10-15 | vm, evaluation       | ~~How can an **evaluator using a program counter** on simple instructions be implemented?~~ |
|      |  0005  | 2025-10-15 | vm, evaluation       | ~~How can **stack frames** be implemented?~~ |
| 0004 |        | 2025-10-15 | ast, passes          | How can a function call node in an AST be split into two nodes, for currying? |
|      |  0004  | 2025-10-15 | typescript, deno     | ~~How can a package be imported in a deno project?~~ |
|      |  0004  | 2025-10-15 | syntax, ast          | ~~How can currying be implemented for function application?~~ |
|      |  0004  | 2025-10-16 | ast                  | ~~Which simple AST representations are useful for analysis, optimization, and lowering prototypes?~~ |
|      |        | 2025-10-18 | control-flow         | ~~How can recursion be implemented for anonymous functions, using 'fix'?~~ |
| 0003 |        | 2025-10-05 | parsing              | How can the language of balanced parentheses be verified by a table-driven parser? |
| 0002 |        | 2025-06-08 | evaluation           | How can de Bruijn levels be used to evaluate unary lambda calculus? |
| 0001 |        | 2025-10-15 | typescript, deno     | How can Deno be used to prototype a function and a test in typescript? |
| 0000 |        | 2025-10-15 | learning             | Can a questions repo, with compact code snippets and notes, speed up learning and implementation? |

## Archived
| Num  | Parent | Created    | Tags                 | Question | Reason for Rejection |
| ---  | ---    | ---        | ---                  | ---      | --- |
|      |        | 2025-10-15 | parsing              | How can recovery be done during tokenization or parsing, via catching of exceptions? |
|      |        | 2025-10-15 | lowering             | How does the transformation from **blocks to linear code** work, with jumps and returns work? |
|      |        | 2025-10-15 | lowering             | How does the transformation from **if-then-else expressions to linear code** with jumps work? |
|      |        | 2025-10-15 | lowering, closure    | How do you store the **environment in stack locals**? |
|      |        | 2025-10-15 | lowering, closure    | How can lambdas be transformed into linear code with an argument, a call/jump, and a return? |
|      |        | 2025-10-15 | memory, closure      | How can a closure copy a captured variable into its own storage? |
|      |        | 2025-10-15 | memory, closure      | How can a closure capture a variable on the stack? |
|      |        | 2025-10-15 | memory               | What is an 'upvalue', as in the Lua interpreter, and how can it be used? |
|      |        | 2025-10-15 | syntax, ast          | How can currying be implemented for function abstraction? |
|      |        | 2025-10-15 | control-flow,optimize| How can a tail-call be detected? |
|      |        | 2025-10-15 | control-flow,optimize| How can the tail-call optimization be implemented? |
|      |        | 2025-10-15 | control-flow, racket | How does the loop command work in Scheme? |
|      |        | 2025-10-15 | control-flow         | Can 'cycle' be used to implement map? |
|      |        | 2025-10-15 | control-flow         | Can 'cycle' be used to implement reduce? |
|      |        | 2025-10-15 | low code             | How can code be edited in or generated from a graphical representation? |
|      |        | 2025-10-15 | bytecode, wasm       | How can WebAssembly code be written and tested? |
|      |        | 2025-10-15 | bytecode             | How does arithmetic and branching work in stack-based programming? |
|      |        | 2025-10-15 | bytecode             | How can functions be defined in stack-based programming? How are they typically stored? |
|      |        | 2025-12-26 | concurrency          | Can a publisher-subscriber system be implemented using one thread per topic, with a message queue and a list of callbacks? |
|      |        | 2025-10-15 | ui, repl             | How can the Monaco editor be deployed onto a static github page? |
|      |        | 2025-10-15 | tools, parsing       | How can parsing be done using Bison? |
|      |        | 2025-10-15 | tools, lexing        | How can tokenisation be done using flex? |
|      |        | 2025-12-26 | tools, ast           | What does TreeSitter do and can I use it for my project? |
|      |        | 2025-10-15 | lexing               | How can a compact tokenizer be implemented using the nullish coalescing operator? |

---
**Copyright (c) 2025 Marco Nikander**
