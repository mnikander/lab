// Copyright (c) 2026 Marco Nikander

export type Expression =
  | Let
  | Application
  | Abstraction
  | Conditional
  | Builtin
  | Id
  | Int
  | Unit;

export type Let = ["let", bindings: [Id, Expression][], "in", body: Expression];
export type Application = ["call", func: Expression, args: Expression[]];
export type Abstraction = ["func", params: Id[], body: Expression];

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
