// Copyright (c) 2025 Marco Nikander

export type Expr   = Nil | Value | Symbol | Cons;
export type Nil    = { tag: 'Nil' };
export type Value  = { tag: 'Value', value: boolean | number };
export type Symbol = { tag: 'Symbol', name: string };
export type Cons   = { tag: 'Cons', left: Expr, right: Expr };

// nil

export const nil: Nil = { tag: 'Nil' };

// atoms

export function value(value: boolean | number): Value {
    return { tag: 'Value', value: value };
}

export function symbol(name: string): Symbol {
    return { tag: 'Symbol', name: name };
}

// cons cells

export function cons(left: Expr, right: Expr): Cons {
    return { tag: 'Cons', left: left, right: right };
}

export function first(cons: Expr): Expr {
    return assert_cons(cons, 'first').left;
}

export function rest(cons: Expr): Expr {
    return assert_cons(cons, 'rest').right;
}

function assert_cons(v: Expr, name: string): Cons {
    if (v.tag !== 'Cons') throw Error(`'${name}' expects 'x' to be a Cons-Cell, got ${v.tag} instead.`);
    else return v;
}
