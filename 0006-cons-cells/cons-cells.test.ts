import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { first, rest, cons, Cons } from "./cons-cells.ts";

describe('must support the construction and access of a pair of', () => {
    it('booleans', () => {
        const pair: Cons = cons(false, true);
        expect(first(pair)).toBe(false);
        expect(rest(pair)).toBe(true);
    });

    it('integers', () => {
        const pair: Cons = cons(1, 2);
        expect(first(pair)).toBe(1);
        expect(rest(pair)).toBe(2);
    });

    it('undefined', () => {
        const pair: Cons = cons(undefined, undefined);
        expect(first(pair)).toBe(undefined);
        expect(rest(pair)).toBe(undefined);
    });

    it('integer and undefined', () => {
        const pair: Cons = cons(42, undefined);
        expect(first(pair)).toBe(42);
        expect(rest(pair)).toBe(undefined);
    });
});
