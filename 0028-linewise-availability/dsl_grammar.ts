// Copyright (c) 2026 Marco Nikander

import * as IR from "./grammar.ts";
import { VariableState } from "./lattice.ts";

export type Op = Use | Define | Drop;
export type Define = ["define", IR.ResourceId];
export type Use = ["use", IR.ResourceId];
export type Drop = ["drop", IR.ResourceId];
