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

export type Metadata    = (Parameter | Alloca)[];
export type Register    = number;
export type Label       = number;

export function get_blocks(func: Function): Block[] {
    return func[4];
}

export function get_lines(block: Block): Line[] {
    return block[1];
}

export function is_body(line: Line): line is Define | Use | Drop {
    return line[0] === "define" || line[0] === "use" || line[0] === "drop";
}

export function is_return(line: Line): line is Return {
    return line[0] === "return";
}

export function is_branch(line: Line): line is Branch {
    return line[0] === "branch";
}
