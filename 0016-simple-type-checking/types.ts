// Copyright (c) 2026 Marco Nikander

export type Type       = Simple | Arrow;
export type Simple     = Top | Bottom | Unit | Bool | Char8 | Int64;
export type Descriptor = "Top" | "Bottom" | "Unit" | "Bool" | "Char8" | "Int64" | "Arrow";

export type Top    = ["Top"]; // 'unknown', all Types belong to Top
export type Bottom = ["Bottom"]; // 'never', impossiblity, never returns
export type Unit   = ["Unit"]; // returns without a meaningful value, useful for procedures
export type Bool   = ["Bool"];
export type Char8  = ["Char8"];
export type Int64  = ["Int64"];

export type Arrow  = ["Arrow", from: Type, to: Type];

export function get_type(t: Type): Descriptor {
    return t[0];
}

export function is_arrow(t: Type): t is Arrow { return t[0] === 'Arrow'; }

export function equivalent(a: Type, b: Type): boolean {
    if (is_arrow(a)) {
        return (is_arrow(b) && equivalent(a[1], b[1]) && equivalent(a[2], b[2]));
    }
    else {
        return get_type(a) === get_type(b);
    }
}

export function flatten_arrow(f: Arrow): Simple[] {
    return impl(f, []);

    function impl(t: Type, list: Simple[]): Simple[] {
        if (is_arrow(t)) {
            list = impl(t[1], list);
            list = impl(t[2], list);
        } else {
            list.push(t);
        }
        return list;
    }
}

export function equivalent_array(a: readonly Type[], b: readonly Type[]): boolean {
    if (a.length !== b.length) {
        return false;
    }
    else {
        for (let i = 0; i < a.length; ++i) {
            if (get_type(a[i]) !== get_type(b[i])) {
                return false;
            }
        }
        return true;
    }
}
