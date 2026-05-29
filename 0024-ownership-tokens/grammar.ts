// Copyright (c) 2026 Marco Nikander

export type Program     = Function[];

export type Function    = ["func",   Result, Parameter[], Alloca[], Block[]];
export type Result      = ["result", Type, Token];
export type Parameter   = ["param",  Type, Token];
export type Alloca      = ["alloca", Type, Token];

export type Block       = ["block",  Line[]];

export type Line        = Constant | Add | Copy | Move | Update | Own | Borrow | Phi | Drop | Call | Return | Branch;
export type Constant    = [Register, "constant"];
export type Add         = [Register, "add",    Register, Register];
export type Copy        = [Register, "copy",   Register];
export type Move        = [Register, "move",   Register];
export type Update      = [Register, "update", Register];
export type Own         = [Register, "own",    Register];
export type Borrow      = [Register, "borrow", Register];
export type Drop        = [null,     "drop",   Register];
export type Call        = [Register, "call",   Label,    Register[]]
export type Return      = [null,     "return", Register];
export type Branch      = [null,     "branch", Register, Label[]];
export type Phi         = [Register, "phi",    Register[]];

export type Type        = "basic" | "pointer";
export type Token       = [ Scope, Replication, Cleanup ];
export type Scope       = "local"         | "caller"     | "global";
export type Replication = "unique"        | "cloneable";
export type Cleanup     = "no_destructor" | "destructor";
export type Register    = number; // slot index
export type Label       = number; // function or block index

export function get_blocks(func: Function): Block[] {
    return func[4];
}

export function get_lines(block: Block): Line[] {
    return block[1];
}

export function is_body(line: Line): line is Constant | Add | Copy | Move | Update | Own | Borrow | Drop | Call {
    return line[1] === "constant"
        || line[1] === "add"
        || line[1] === "copy"
        || line[1] === "move"
        || line[1] === "update"
        || line[1] === "own"
        || line[1] === "borrow"
        || line[1] === "drop"
        || line[1] === "call"
}

export function is_phi(line: Line): line is Phi {
    return line[1] === "phi";
}

export function is_branch(line: Line): line is Branch {
    return line[1] === "branch";
}

export function is_return(line: Line): line is Return {
    return line[1] === "return";
}
