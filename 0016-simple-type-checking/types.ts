// Copyright (c) 2026 Marco Nikander

export type Type   = Top | Bottom | Unit | Bool | Char8 | Int64 ;

export type Top    = { type: "Top" }; // 'unknown', all Types belong to Top
export type Bottom = { type: "Bottom" }; // 'never', impossiblity, never returns
export type Unit   = { type: "Unit" }; // returns without a meaningful value, useful for procedures

export type Bool   = { type: "Bool" };
export type Char8  = { type: "Char8" };
export type Int64  = { type: "Int64" };

export function equivalent(a: Type, b: Type): boolean {
    return a.type === b.type;
}
