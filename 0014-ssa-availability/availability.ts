// Copyright (c) 2026 Marco Nikander

export type Definition = string;
export type Label      = string;

export type Block = {
    name: Label,
    predecessors: Label[],
    successors: Label[],
    body: Set<Definition>,
};

export type Availability = {
    name: Label,
    in: Set<Definition>,
    out: Set<Definition>,
};

export function traverse(block: Block, in_set: Set<Definition>): Set<Definition> {
    let out_set: Set<Definition> = new Set();
    out_set = out_set.union(in_set);
    out_set = out_set.union(block.body);
    return out_set;
} 
