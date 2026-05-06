// Copyright (c) 2026 Marco Nikander

import { Label } from "./grammar.ts";

export type CFG = Node[];

export type Node = {
  name: Label;
  predecessors: number[];
  successors: number[];
};
