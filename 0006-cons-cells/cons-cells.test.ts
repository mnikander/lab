import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { nil, Nil, first, rest, cons, Cons, atom, Atom, symbol, Symbol } from "./cons-cells.ts";

describe('must allow initialization of', () => {
    it('nil', () => {
        const s: Nil = nil;
        expect(s.tag).toEqual('Nil');
    });
    
    it('booleans', () => {
        const s: Atom = atom(true);
        expect(s.tag).toEqual('Atom');
        expect(s.value).toEqual(true);
    });
    
    it('integers', () => {
        const s: Atom = atom(1);
        expect(s.tag).toEqual('Atom');
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
        const pair: Cons = cons(atom(false), atom(true));
        expect(first(pair)).toEqual(atom(false));
        expect(rest(pair)).toEqual(atom(true));
    });

    it('integers', () => {
        const pair: Cons = cons(atom(1), atom(2));
        expect(first(pair)).toEqual(atom(1));
        expect(rest(pair)).toEqual(atom(2));
    });

    it('nil', () => {
        const pair: Cons = cons(nil, nil);
        expect(first(pair)).toEqual(nil);
        expect(rest(pair)).toEqual(nil);
    });

    it('integer and nil', () => {
        const pair: Cons = cons(atom(42), nil);
        expect(first(pair)).toEqual(atom(42));
        expect(rest(pair)).toEqual(nil);
    });
});

describe('must support the construction and access of', () => {
    it('a list of integers', () => {
        const list: Cons = cons(atom(1), cons(atom(2), cons(atom(3), nil)));
        expect(first(list)).toEqual(atom(1));
        expect(first(rest(list))).toEqual(atom(2));
        expect(first(rest(rest(list)))).toEqual(atom(3));
        expect(rest(rest(rest(list)))).toEqual(nil);
    });

    it('a tree of integers', () => {
        const list: Cons = cons(cons(atom(1), atom(2)), cons(atom(3), nil));
        expect(first(first(list))).toEqual(atom(1));
        expect(rest(first(list))).toEqual(atom(2));
        expect(first(rest(list))).toEqual(atom(3));
        expect(rest(rest(list))).toEqual(nil);
    });
});
