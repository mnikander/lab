# Question
<!-- What am I figuring out? -->

Can a questions repo, with compact code snippets and notes, speed up learning and implementation?

Date: 2025-10-15

## Resources
<!-- Where can I find relevant information? -->

## Plan and Hypothesis
<!-- What do I want to do? -->

Steps:
- set up a repo for these short questions
- create a simple overview table to keep track of progress in one place (instead of using issues)
- create a template, like a mini lab-report, for these questions and experiments
- create a notes folder, with per-topic markdown files, where I consolidate notes from the topics I'm reading in ultra compact form
- brainstorm questions
- prioritize questions
- do the first couple of questions, preferably small and simple things
- reflect on how it's going and refine the procedure / template as I go along
- try to find ways to make it even more light-weight
- focus on questions where I am really curious or excited, so that motivation is strong

I will make an assessment of how this experiment is going, on or around the 2025-10-31.

## Hypothesis
<!-- What do I think is going to happen? -->

I expect that it will be a pretty big adjustment to make.
It will probably feel a bit daunting at first.
I expect that keeping the questions and coding exercises as small as possible will be beneficial to motivation.
I expect that completing questions will feel good, especially once I combine it with targeted reading.
I suspect that larger questions will only be an option for the weekend.
I suspect that for larger questions, strong interest in the topic will be especially important for completion.

## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

Set up the repo and template as described.
Created the this whole project as the very first question.
Tried several smaller 2-3 hour questions (0001 - 0004) and then a much larger question (0005).
Got a little stuck in 0005 with the implementation of function calls for 3-address code.
I think the 3AC prototype took more than 10 hours.
At the same time, external circumstances halted development work for several weeks.
That froze this project entirely.
Picked it up again with a 2 hour exercise on cons-cells (0006), which was good for motivation.
Creating that 3-address-code prototype was instrumental in getting started in the domain of IRs.
The prototype served as the foundation for a separate repository for an IR and the exploration of static single assignment form.
That prototype opened the door.
Did a 2 hour experiment 0007 on how to get Datalog working, first I tried Souffle and then tried Datalog in Racket.
Again, this experiment opened the door, this time to learning Datalog.
I did a ~10 hour experiment 0008 where I worked through Datalog tutorials and one particularly challenging exercise.
It did drag on for a bit, but it got me into the topic.

## Findings
<!-- What did I learn? -->

- doing a coding exercise after work _is_ viable and practical
- it's important to keep an eye on the time though, so I don't lose sleep over it
- exercises during the week are best on the order of 60-90 minutes, so the questions should be really small
- it's fun to try out new things in this quick and easy context, without having to think/worry about a larger codebase
- this could be a really good way to try out a wider variety of things, outside of languages and compilers as well
- large questions bring a greater risk of getting stuck
- 1 to 3 hour questions are typically better for motivation: it's easier to get started and more satisfying
- 10 hour+ questions often feel like a drag, but they can really open the door to some new stuff
- it's unclear how to split a larger task into several smaller ones, within the current folder/repository structure -- this _is_ actually a problem
- usually only one question is in progress at a time, so having one large question open for a long time, effectively suppresses small questions -> it would be wise to move large questions into another repo sooner so small experiments can continue here, one at a time
- the 'Hypothesis' heading is not necessary for things like doing a tutorial, so the heading was removed to simplify the template
- 'notes' were never taken separately, so the folder was removed
- the notes _within_ the experiments are useful for future reference, especially the ones on setting up / trying a framework or tool for the first time -- those have been valuable references to look things up again a few weeks later
- the desire to work on the main project is strong, and often it feels off-topic to do a coding lab -- that feeling is an obstacle to doing more of these experiments
- coding labs are extremely effective in opening the door to new topics and getting started
- it was tricky to keep at it during work weeks, so forming a habit or a weekly routine around this could be really helpful (one lab per week?)

## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->

- How can the repository be structured so that large experiments be broken up into several smaller ones, with shared code?
- How can the mindset be shifted from the main project to more small coding labs?
- Can these coding labs be made into a regular habit?

---
**Copyright (c) 2025 Marco Nikander**
