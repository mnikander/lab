// Copyright (c) 2026 Marco Nikander

export type Block        = [ tag: "block", Bindings, Instructions];
export type Bindings     = [ tag: "bindings",     ...ResourceId[]];
export type Instructions = [ tag: "instructions", ...Line[] ];

export type Line         = Let | Drop | Terminator;
export type Let          = [ tag: "let",          ResourceId, value: Operation ]; // define a Resource
export type Drop         = [ tag: "drop",         ResourceId ];

export type Operation    = Call | Borrow | Load | Unary | Binary;
export type Call         = [ tag: "call",         function: FunctionId, Arguments ];
export type Borrow       = [ tag: "borrow",       Peek ]; // take the address of a resource and create a read-only pointer
export type Load         = [ tag: "load",         Peek | Move ]; // dereference a pointer and load the value
export type Unary        = [ tag: "unary",        Operand ];
export type Binary       = [ tag: "binary",       Operand, Operand ];

export type Terminator   = Return | Jump | Branch;
export type Jump         = [ tag: "jump",         targetBlock: BlockId ];
export type Branch       = [ tag: "branch",       condition: Operand, thenBlock: BlockId, elseBlock: BlockId, Arguments ];
export type Return       = [ tag: "return",       ResourceId ];

export type Operand      = Peek | Move | Constant;
export type Peek         = [ tag: "peek",         ResourceId ]; // access a Resource
export type Move         = [ tag: "move",         ResourceId ]; // access and destroy a Resource
export type Constant     = [ tag: "constant",     value: number ];
export type Arguments    = [ tag: "arguments",    ...Operand[]];
export type ResourceId   = `%${number}`;
export type FunctionId   = `@${number}`;
export type BlockId      = `^${number}`;

export function to_index(id: ResourceId | FunctionId | BlockId): number {
    return Number(id.slice(1));
}
