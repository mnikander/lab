// Copyright (c) 2026 Marco Nikander

import * as HIGH from "./grammar.ts";

export type Node = {
  name: HIGH.Label;
  predecessors: number[];
  successors: number[];
};

export type CFG = Node[];
