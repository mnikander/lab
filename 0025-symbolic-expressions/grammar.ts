// Copyright (c) 2026 Marco Nikander

export type Expr     = Atom | List;
export type Atom     = Variable | Boolean | Number;
export type List     = Expr[];
export type Variable = string; // TODO: restrict the allowed names using a template string
export type Boolean  = boolean;
export type Number   = number;

