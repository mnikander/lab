// Copyright (c) 2026 Marco Nikander

export type Block = ["block", Let[], Tail];
export type Let = ["let", variable: Id, value: Expression];
export type Tail = Expression | Conditional;

export type Expression = Atom | Application;
export type Atom =
  | Block
  | Application
  | Abstraction
  | Builtin
  | Id
  | Int
  | Unit;

// TODO: 'Abstraction' is very similar to the block definition. Can I use functions at the top level and get rid of the Block?
export type Application = ["call", Atom, Expression[]];
export type Abstraction = ["func", Id[], Block];

export type Conditional = [
  "if",
  cond: Expression,
  thenExp: Expression,
  elseExp: Expression,
];

export type Builtin = Unary | Binary;
export type Unary = ["unary", op: Op_unary, args: [Expression]];
export type Binary = ["binary", op: Op_binary, args: [Expression, Expression]];

export type Op_unary = "~";
export type Op_binary = Op_arithmetic | Op_comparison;
export type Op_arithmetic = "+" | "-" | "*" | "/" | "%" | "min" | "max";
export type Op_comparison = "<" | ">" | "<=" | ">=" | "==" | "!=";
export type Id = ["id", string];
export type Int = ["int", number];
export type Unit = ["unit"];
