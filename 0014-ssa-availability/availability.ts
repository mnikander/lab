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
    if (cfg.length > 0 && cfg[0].name !== 'Entry') {
        throw Error(`Expected CFG block 0 to be called 'Entry', got '${cfg[0].name}' instead`);
    }

    const avail: Availability[] = cfg.map(init);
    const worklist: Set<number> = new Set();

    // TODO: find an algorithm like 'std::iota' to do this
    for (let i = 0; i < cfg.length; ++i) {
        worklist.add(i);
    }
    worklist.forEach(visit);
    return avail;
    
    function visit(block: number) {
        avail[block].out_set = traverse(cfg[block], avail[block].in_set);
    }

    function init(block: Block): Availability {
        return { name: block.name, in_set: new Set(), out_set: new Set() };
    }
}
