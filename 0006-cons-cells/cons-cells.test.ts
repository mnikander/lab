import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { nil, Nil, first, rest, cons, Cons, value, Value, symbol, Symbol } from "./cons-cells.ts";

describe('must allow initialization of', () => {
    it('nil', () => {
        const s: Nil = nil;
        expect(s.tag).toEqual('Nil');
    });
    
    it('booleans', () => {
        const s: Value = value(true);
        expect(s.tag).toEqual('Value');
        expect(s.value).toEqual(true);
    });
    
    it('integers', () => {
        const s: Value = value(1);
        expect(s.tag).toEqual('Value');
        expect(s.value).toEqual(1);
    });

    it('symbols', () => {
        const s: Symbol = symbol('x');
        expect(s.tag).toEqual('Symbol');
        expect(s.name).toEqual('x');
    });
});

describe('must support the construction and access of a pair of', () => {
    it('booleans', () => {
        const pair: Cons = cons(value(false), value(true));
        expect(first(pair)).toEqual(value(false));
        expect(rest(pair)).toEqual(value(true));
    });

    it('integers', () => {
        const pair: Cons = cons(value(1), value(2));
        expect(first(pair)).toEqual(value(1));
        expect(rest(pair)).toEqual(value(2));
    });

    it('nil', () => {
        const pair: Cons = cons(nil, nil);
        expect(first(pair)).toEqual(nil);
        expect(rest(pair)).toEqual(nil);
    });

    it('integer and nil', () => {
        const pair: Cons = cons(value(42), nil);
        expect(first(pair)).toEqual(value(42));
        expect(rest(pair)).toEqual(nil);
    });
});

describe('must support the construction and access of', () => {
    it('a list of integers', () => {
        const list: Cons = cons(value(1), cons(value(2), cons(value(3), nil)));
        expect(first(list)).toEqual(value(1));
        expect(first(rest(list))).toEqual(value(2));
        expect(first(rest(rest(list)))).toEqual(value(3));
        expect(rest(rest(rest(list)))).toEqual(nil);
    });

    it('a tree of integers', () => {
        const list: Cons = cons(cons(value(1), value(2)), cons(value(3), nil));
        expect(first(first(list))).toEqual(value(1));
        expect(rest(first(list))).toEqual(value(2));
        expect(first(rest(list))).toEqual(value(3));
        expect(rest(rest(list))).toEqual(nil);
    });
});
