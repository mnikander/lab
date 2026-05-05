// Copyright (c) 2026 Marco Nikander

export type Program      = readonly Function[];
export type Function     = { name: Label, params: Register[], blocks: Block[] };
export type Block        = { name: Label, phis: Phi[], lines: Line[], terminator: Terminator };
export type Line         = Call | Memory | Arithmetic | Comparison;

export type Phi          = [ destination: Register, tag: 'phi',           inputs: [label: Label, value: Register][]];
export type Call         = [ destination: Register, tag: 'call',          label: Label, arguments: Register[] ];

export type Memory       = Constant | Copy | Own | Borrow | Load | Drop;
export type Constant     = [ destination: Register, tag: 'constant',      value: Primitive ];
export type Copy         = [ destination: Register, tag: 'copy',          value: Register ];
export type Own          = [ destination: Register, tag: 'own',           value: Register ];
export type Borrow       = [ destination: Register, tag: 'borrow',        value: Register ];
export type Load         = [ destination: Register, tag: 'load',          pointer: Register ];
export type Drop         = [ destination: Register, tag: 'drop'];

export type Arithmetic   = Add | Subtract | Multiply | Divide | Remainder | Minimum | Maximum | Negative;
export type Add          = [ destination: Register, tag: 'add',           left: Register, right: Register ];
export type Subtract     = [ destination: Register, tag: 'subtract',      left: Register, right: Register ];
export type Multiply     = [ destination: Register, tag: 'multiply',      left: Register, right: Register ];
export type Divide       = [ destination: Register, tag: 'divide',        left: Register, right: Register ];
export type Remainder    = [ destination: Register, tag: 'remainder',     left: Register, right: Register ];
export type Minimum      = [ destination: Register, tag: 'minimum',       left: Register, right: Register ];
export type Maximum      = [ destination: Register, tag: 'maximum',       left: Register, right: Register ];
export type Negative     = [ destination: Register, tag: 'negate',        left: Register ];

export type Comparison   = Equal | Unequal | Less | LessEqual | Greater | GreaterEqual;
export type Equal        = [ destination: Register, tag: 'equal',         left: Register, right: Register ];
export type Unequal      = [ destination: Register, tag: 'unequal',       left: Register, right: Register ];
export type Less         = [ destination: Register, tag: 'less',          left: Register, right: Register ];
export type LessEqual    = [ destination: Register, tag: 'less_equal',    left: Register, right: Register ];
export type Greater      = [ destination: Register, tag: 'greater',       left: Register, right: Register ];
export type GreaterEqual = [ destination: Register, tag: 'greater_equal', left: Register, right: Register ];

export type Terminator   = Jump | Branch | Return;
export type Jump         = [ destination: null,     tag: 'jump',          block: Label ];
export type Branch       = [ destination: null,     tag: 'branch',        condition: Register, block: [Label, Label] ];
export type Return       = [ destination: null,     tag: 'return',        left: Register ];

export type Register     = `%${string}`;
export type Label        = `@${string}`;
export type Primitive    = { value: number };

export enum Get {
    Dest   = 0,
    Tag    = 1,
    Type   = 2,
    Left   = 3, // alias to first argument
    Right  = 4, // alias to second argument
}
