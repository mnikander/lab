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
    in_set: Set<Definition>,
    out_set: Set<Definition>,
};

export function traverse(block: Block, in_set: Set<Definition>): Set<Definition> {
    let out_set: Set<Definition> = new Set();
    out_set = out_set.union(in_set);
    out_set = out_set.union(block.body);
    return out_set;
}

export function iterate(cfg: Block[]): Availability[] {
    const avail: Availability[] = cfg.map(init);
    for (let i = 0; i < cfg.length; ++i) {
        avail[i].out_set = traverse(cfg[i], avail[i].in_set);
    }
    return avail;
    
    function init(block: Block): Availability {
        return { name: block.name, in_set: new Set(), out_set: new Set() };
    }
}
