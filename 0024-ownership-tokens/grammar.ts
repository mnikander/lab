// Copyright (c) 2026 Marco Nikander

export type Program     = Function[];

export type Function    = ["func",   Result, Parameter[], Alloca[], Block[]];
export type Result      = ["result", Token];
export type Parameter   = ["param",  Token];
export type Alloca      = ["alloca", Token];

export type Block       = ["block",  Line[]];

export type Line        =  Phi | Constant | Add | Copy | Move | Own | Borrow | Load | Call | Drop | Branch | Return;
export type Phi         = ["assign", Register, "phi",     Register[]];
export type Constant    = ["assign", Register, "constant"]; // it doesn't matter what the value of the constant is
export type Add         = ["assign", Register, "add",     Register, Register]; // analogous to all other arithmetic and logical operations
export type Copy        = ["assign", Register, "copy",    Register];
export type Move        = ["assign", Register, "move",    Register];
export type Own         = ["assign", Register, "own",     Register];
export type Borrow      = ["assign", Register, "borrow",  Register];
export type Load        = ["assign", Register, "load",    Register];
export type Call        = ["assign", Register, "call",    Label,    Register[]]
export type Drop        = ["drop",   Register];
export type Branch      = ["branch", Register, Label[]];
export type Return      = ["return", Register];

export type Token       = ["token", Scope, Duplication, Cleanup, Type ];
export type Type        = Int | Borrowed | Owned;
export type Int         = ["int"];
export type Borrowed    = ["borrowed", Token];
export type Owned       = ["owned", Token];
export type Scope       = "local"     | "caller";
export type Duplication = "unique"    | "cloneable";
export type Cleanup     = "must_drop" | "no_drop";
export type Register    = number; // slot index
export type Label       = number; // function or block index

export function get_params(func: Function): Parameter[] {
    return func[2];
}

export function get_allocas(func: Function): Alloca[] {
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

export function is_int(t: Type): t is Int {
    return t.length === 1 && t[0] === "int";
}

export function is_owned(t: Type): t is Owned {
    return t.length === 2 && t[0] === "owned";
}

export function is_borrowed(t: Type): t is Borrowed {
    return t.length === 2 && t[0] === "borrowed";
}
