// Copyright (c) 2026 Marco Nikander
import { Availability, Block } from "./types.ts"

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
        const old_size: readonly [number, number] = out_size(block);

        // merge predecessor out-sets into the current in-set
        cfg[block].predecessors.forEach((pred: number) => { join_in(pred, block); });
        cfg[block].predecessors.forEach((pred: number) => { meet_in(pred, block); });

        // traverse the block itself
        avail[block].out_join = avail[block].in_join.union(cfg[block].body);
        avail[block].out_meet = avail[block].in_meet.union(cfg[block].body);

        const new_size: readonly [number, number] = out_size(block);

        // if the out-sets of this block changed, then enqueue all its successors into the worklist
        if (old_size[0] !== new_size[0] || old_size[1] !== new_size[1]) {
            cfg[block].successors.forEach((successor: number) => { worklist.add(successor) });
        }
    }

    function join_in(predecessor: number, current: number) {
        avail[current].in_join = avail[current].in_join.union(avail[predecessor].out_join);
    }

    function meet_in(predecessor: number, current: number) {
        avail[current].in_meet = avail[current].in_join.intersection(avail[predecessor].out_meet);
    }

    function out_size(index: number): [number, number] {
        return [avail[index].out_join.size, avail[index].out_join.size]
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
