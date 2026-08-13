// Copyright (c) 2026 Marco Nikander

export type Expr     = Atom | List;
export type Atom     = Symbol | Boolean | Number;
export type List     = Expr[];
export type Symbol   = string; // TODO: restrict the allowed names using a template string
export type Boolean  = boolean;
export type Number   = number;

export function is_symbol(e: Expr): e is Symbol {
  return typeof e === "string";
}

export function is_boolean(e: Expr): e is Boolean {
  return typeof e === "boolean";
}

export function is_number(e: Expr): e is Number {
  return typeof e === "number";
}

export function is_atom(e: Expr): e is Atom {
  return is_symbol(e) || is_boolean(e) || is_number(e);
}

export function is_list(e: Expr): e is List {
  return Array.isArray(e) && (e.length == 0 || is_symbol(e[0]));
}

