// Copyright (c) 2026 Marco Nikander
import { Availability, Block, Definition } from "./types.ts"

export function traverse(block: Block, in_set: Set<Definition>): Set<Definition> {
    let out_set: Set<Definition> = new Set();
    out_set = out_set.union(in_set);
    out_set = out_set.union(block.body);
    return out_set;
}

export function iterate(cfg: Block[]): Availability[] {
    const avail: Availability[] = cfg.map(init);
    const worklist: Set<number> = new Set();

    // TODO: find an algorithm like 'std::iota' to do this
    for (let i = 0; i < cfg.length; ++i) {
        worklist.add(i);
    }
    worklist.forEach(visit);
    return avail;
    
    function visit(block: number) {
        worklist.delete(block);

        // TODO: merge predecessor out-sets into the current in-set

        // traverse the block itself
        avail[block].out_join = traverse(cfg[block], avail[block].in_join);
        avail[block].out_meet = traverse(cfg[block], avail[block].in_meet);

        // TODO: if the out-sets of this block changed, then enqueue all its successors into the worklist
    }

    function init(block: Block): Availability {
        return {
            index: block.index,
            in_join:  new Set(),
            in_meet:  new Set(),
            out_join: new Set(),
            out_meet: new Set(),
        };
    }
}
