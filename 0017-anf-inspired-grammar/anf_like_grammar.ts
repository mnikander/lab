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
export type Application = ["call", func: Atom, args: Expression[]];
export type Abstraction = ["func", params: Id[], body: Block];

export type Conditional = [
  "if",
  cond: Expression,
  thenExp: Expression,
  elseExp: Expression,
];

export type Builtin = Op_unary | Op_arithmetic | Op_comparison;
export type Op_unary = "~";
export type Op_arithmetic = "+" | "-" | "*" | "/" | "%" | "min" | "max";
export type Op_comparison = "<" | ">" | "<=" | ">=" | "==" | "!=";

export type Id = string;
export type Int = ["int", number];
export type Unit = ["unit"];
