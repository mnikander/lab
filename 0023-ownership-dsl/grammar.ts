// Copyright (c) 2026 Marco Nikander

export type Program     = Function[];

export type Function    = ["func",   Label, Result, Parameter[], Alloca[], Block[]];
export type Result      = ["result", Type];
export type Parameter   = ["param",  Local | Escape];
export type Alloca      = ["alloca", Local | Global];
export type Local       = ["local",  Register, ["affine"]           , Type];
export type Escape      = ["escape", Register, ["affine" | "linear"], Type];
export type Global      = ["global", Register,            ["linear"], Type];
export type Block       = ["block",  Label, Line[]];

export type Line        = Define | Use | Drop | Branch | Return;
export type Define      = ["define", Register];
export type Use         = ["use",    Register];
export type Drop        = ["drop",   Register];
export type Branch      = ["branch", Label[]];
export type Return      = ["return", Register];

export type Type        = Basic | Pointer;
export type Pointer     = ["pointer", address: number, target_type: Type];
export type Basic       = "unit" | "i64";
export type Register    = `%${string}`;
export type Label       = `@${string}`;
