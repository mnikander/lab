# Question
<!-- What am I figuring out? -->

How can the availability be checked inside a basic block, line-by-line?

Date:   2026-10-08
Status: In progress

## Resources
<!-- Where can I find relevant information? -->

- [lab 18](0018-lifetime-language/readme.md)
- [lab 23](0023-ownership-dsl/readme.md) especially the [tests](0023-ownership-dsl/main.test.ts)

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno test
```

## Description
<!-- How do I want to approach the problem? -->
<!-- What do I think is going to happen? -->

**Inputs**
1. `VariableState[]` - Variable states at the beginning of the block (from CFG availability analysis)
2. `number[][]` - Points-to set
3. `Line[]` - IR code for the block 

**Outputs**
1. Result containing the variable states at the end of the block, or an error message (which includes the line number)

## Steps
<!-- What did I do? -->

- [x] copy/paste VariableState from lab 27
- [x] define function signature
- [x] create trivial test-cases
- [x] define simplified grammar for source language, including block parameters
- [x] define DSL define/use/drop/return
- [x] for each instruction, translate it into a combination of define/use/drop/return
- [x] update the variable states using the DSL ops
- [x] iterate over the lines
- [x] interpret pointer drops as pointee uses
- [x] if any errors occur, return an error message, otherwise return the update states at the end
- [ ] use of a pointer-type variable should also be a use of its pointee
- [ ] return needs to be treated as a 'use' of all variables which are not dropped

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
