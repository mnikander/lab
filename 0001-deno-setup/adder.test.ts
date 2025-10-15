import { adder } from "./adder.ts"

Deno.test("answer", () => {
    const almost = adder(37);
    const answer = almost(5);
    console.assert(answer == 42);
});

Deno.test("three", () => {
    const addOne = adder(1);
    console.assert(addOne(2) == 3);
});
