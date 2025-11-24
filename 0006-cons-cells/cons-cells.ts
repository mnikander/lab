// Copyright (c) 2025 Marco Nikander

export type Value = undefined | boolean | number | Cons;
export type Cons  = { tag: 'Cons', left: Value, right: Value };

export function cons(left: Value, right: Value): Cons {
    return { tag: 'Cons', left: left, right: right };
}

export function first(cons: Cons): Value {
    return cons.left;
}

export function rest(cons: Cons): Value {
    return cons.right;
}

