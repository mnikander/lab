# Question
<!-- What am I figuring out? -->

How can deno be used to prototype a function and a test in typescript?

Date: 2025-10-15

## Resources
<!-- Where can I find relevant information? -->

- [deno homepage](https://deno.com/)
- [unit testing in deno](https://docs.deno.com/runtime/fundamentals/testing/)

## Plan
<!-- What do I want to do? -->

- install deno
- build a hello world script (how do I print/log?)
- create a test-case (expect true === true) and try to run in
- write down the commands I need to build and run stuff, here in these notes

## Hypothesis
<!-- What do I think is going to happen? -->

I suspect it will be pretty quick and easy to do, albeit with some unexpected quirks.

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

```bash
curl -fsSL https://deno.land/install.sh | sh   # recommended installation method on homepage
```
I hope this doesn't conflict with any apt-managed packages.
I added the bash bindings.
I started `/home/marco/.deno/bin/deno --help` for a primer.
There is really cool stuff in there.
I tried the deno REPL. Really convenient to have, and it's nice that it supports TS out-of-the-box.
Wrote a hello-world and ran it with: `deno run hello-world.ts`
Tried the linter with `deno lint --watch` but didn't really know what to make of it.
Wrote adder.ts and adder.test.ts, struggled with the import for a moment: I have to use a relative path with the .ts file ending.
I noticed the includes for `Deno.test()` were not being resolved correctly.
I installed the deno extension from denoland and activated it, to resolve this.
vscode created a settings json which activates deno by default, so I probably won't have to manually activate the extension via the context menu "F1 => Deno: Enable" in the future.

## Findings
<!-- What did I learn? -->

Deno is super easy to use.
It's exactly the tool I need for the rapid prototyping I want to do.
Unit tests are fast and easy to write.
The REPL could be really useful.
Trying this out was definitely worth it!

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

Read more about unit tests in Deno, to get faster and check things such as exceptions.
Figure out how to use the linter and what I can do with it.

---
**Copyright (c) 2025 Marco Nikander**
