// Copyright (c) 2026 Marco Nikander

export type Program     = Function[];

export type Function    = ["func",   Result, Parameter[], Alloca[], Block[]];
export type Result      = ["result", Type];
export type Parameter   = ["param",  Local | Escape];
export type Alloca      = ["alloca", Local | Global];
export type Local       = ["local",  "affine"           , Type];
export type Escape      = ["escape", "affine" | "linear", Type];
export type Global      = ["global",            "linear", Type];

export type Block       = ["block",  Line[]];

export type Line        = Define | Use | Drop | Return | Branch;
export type Define      = ["define", Register];
export type Use         = ["use",    Register];
export type Drop        = ["drop",   Register];
export type Return      = ["return", Register];
export type Branch      = ["branch", Label[]];

export type Type        = Basic | Pointer;
export type Pointer     = ["pointer", address: number, target_type: Type];
export type Basic       = "unit" | "i64";

export type Register    = number;
export type Label       = number;
