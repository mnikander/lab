// Copyright (c) 2026 Marco Nikander

import * as G from "./grammar.ts";

export type Deps = Dependency[];
export type Dependency = ["register", number, TokenId[]];
export type TokenId = ["token_id", number] | ["target_of", TokenId];

// TODO: implement this
export function compute_dependencies(_fun: G.Function): Deps {
  return [];
}
