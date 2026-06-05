// Copyright (c) 2026 Marco Nikander

export type Program     = Function[];

export type Function    = ["func",   Result, Parameter[], Local[], Block[]];
export type Result      = ["result", Type];
export type Parameter   = ["param",  Type];
export type Local       = ["local", Type];

export type Block       = ["block",  Line[]];

export type Line        =  Phi | Constant | Add | Copy | Move | Own | Borrow | Load | Call | Drop | Branch | Return;
export type Phi         = ["assign", Resource, "phi",     Resource[]];
export type Constant    = ["assign", Resource, "constant"]; // it doesn't matter what the value of the constant is
export type Add         = ["assign", Resource, "add",     Resource, Resource]; // analogous to all other arithmetic and logical operations
export type Copy        = ["assign", Resource, "copy",    Resource];
export type Move        = ["assign", Resource, "move",    Resource];
export type Own         = ["assign", Resource, "own",     Resource];
export type Borrow      = ["assign", Resource, "borrow",  Resource];
export type Load        = ["assign", Resource, "load",    Resource];
export type Call        = ["assign", Resource, "call",    Label,    Resource[]]
export type Drop        = ["drop",   Resource];
export type Branch      = ["branch", Resource, Label[]];
export type Return      = ["return", Resource];

export type Type            = ["type", Scope, Duplication, Cleanup, UnqualifiedType ];
export type UnqualifiedType = Int | Borrowed | Owned;
export type Int             = ["int"];
export type Borrowed        = ["borrowed", Type];
export type Owned           = ["owned", Type];
export type Scope           = "inner"     | "outer";
export type Duplication     = "unique"    | "cloneable";
export type Cleanup         = "must_drop" | "no_drop";
export type Resource        = number; // slot index
export type Label           = number; // function or block index

export function get_params(func: Function): Parameter[] {
    return func[2];
}

export function get_locals(func: Function): Local[] {
    return func[3];
}

export function get_blocks(func: Function): Block[] {
    return func[4];
}

export function get_lines(block: Block): Line[] {
    return block[1];
}

export function is_phi(line: Line): line is Phi {
    return line[0] === "assign" && line[2] === "phi";
}

export function is_body(line: Line): line is Constant | Add | Copy | Move | Own | Borrow | Load | Call | Drop {
    return line[0] === "assign" && line[2] === "constant"
        || line[0] === "assign" && line[2] === "add"
        || line[0] === "assign" && line[2] === "copy"
        || line[0] === "assign" && line[2] === "move"
        || line[0] === "assign" && line[2] === "own"
        || line[0] === "assign" && line[2] === "borrow"
        || line[0] === "assign" && line[2] === "load"
        || line[0] === "assign" && line[2] === "call"
        || line[0] === "drop";
}

export function is_branch(line: Line): line is Branch {
    return line[0] === "branch";
}

export function is_return(line: Line): line is Return {
    return line[0] === "return";
}

export function is_int(t: UnqualifiedType): t is Int {
    return t.length === 1 && t[0] === "int";
}

export function is_owned(t: UnqualifiedType): t is Owned {
    return t.length === 2 && t[0] === "owned";
}

export function is_borrowed(t: UnqualifiedType): t is Borrowed {
    return t.length === 2 && t[0] === "borrowed";
}
