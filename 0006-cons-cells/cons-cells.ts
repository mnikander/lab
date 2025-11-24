// Copyright (c) 2025 Marco Nikander

export type Value = Nil | Atom | Cons;
export type Nil   = { tag: 'Nil' };
export type Atom  = { tag: 'Atom', value: boolean | number };
export type Cons  = { tag: 'Cons', left: Value, right: Value };

export const nil: Nil = { tag: 'Nil' };

export function atom(value: boolean | number): Atom {
    return { tag: 'Atom', value: value };
}

export function cons(left: Value, right: Value): Cons {
    return { tag: 'Cons', left: left, right: right };
}

export function first(cons: Value): Value {
    return assert_cons(cons, 'first').left;
}

export function rest(cons: Value): Value {
    return assert_cons(cons, 'rest').right;
}

function assert_cons(v: Value, name: string): Cons {
    if (v.tag !== 'Cons') throw Error(`'${name}' expects 'x' to be a Cons-Cell, got ${v.tag} instead.`);
    else return v;
}
