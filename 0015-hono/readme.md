# Question
<!-- What am I figuring out? -->

How can Hono be used to create a simple web backend?

Date:   2026-03-16
Status: In progress, as of 2026-03-21

## Resources
<!-- Where can I find relevant information? -->

1. [Hono Docs](https://hono.dev/docs/)
2. [Hono: Getting Started](https://hono.dev/docs/getting-started/basic)

## Plan
<!-- What do I want to do? -->
<!-- What do I think is going to happen? -->

1. Install Hono via Deno
2. Go through a simple tutorial

## Running the Code
<!-- What steps are required to run the code? -->

```bash
deno task start
```

or:
```bash
deno run --allow-net main.ts
```

### GET request
Type the following into the developer console in the browser:
```js
fetch("data");
```
or
```js
let response = await fetch("/data");
let data = await response.json();
```

### POST request

```js
await fetch("/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ year: 2026, month: 3, day: 16, total: 65 })
});
```


## Experiment
<!-- What did I do? -->
<!-- How do you run the code? -->

- defined a GET request
- defined a POST request
- tried out the developer console in the browser to send and receive data

## Findings
<!-- What did I learn? -->



## Future Work
<!-- Are there follow-up questions? -->
<!-- Can I create a concrete ticket/issue from this? -->



---
**Copyright (c) 2026 Marco Nikander**
