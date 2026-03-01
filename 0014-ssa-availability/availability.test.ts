import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { iterate } from "./availability.ts";
import { Availability, Block, Definition } from "./types.ts"

describe('block traversal', () => {
    it('empty block', () => {
        const block: Block = { index: 0, predecessors: [], successors: [], body: new Set() };
        const in_join:  Set<Definition> = new Set();
        const out_join: Set<Definition> = in_join.union(block.body);
        expect(out_join.size).toEqual(0);
    });

    it('block with two definitions', () => {
        const block: Block = { index: 0, predecessors: [], successors: [], body: new Set(['a', 'b']) };
        const in_join:  Set<Definition> = new Set();
        const out_join: Set<Definition> = in_join.union(block.body);
        expect(out_join.size).toEqual(2);
    });
});

describe('create availability', () => {
    it('one block without variables', () => {
        const cfg: Block[] = [
            { index: 0, predecessors: [], successors: [], body: new Set() },
        ];
        const avail: Availability[] = iterate(cfg);
        expect(avail.length).toBe(1);
        expect(avail[0].index).toBe(0);
        expect(avail[0].in_join.size).toBe(0);
        expect(avail[0].out_join.size).toBe(0);
    });

    it('one block with two variables', () => {
        const cfg: Block[] = [
            { index: 0, predecessors: [], successors: [], body: new Set(['a', 'b']) },
        ];
        const avail: Availability[] = iterate(cfg);
        expect(avail.length).toBe(1);
        expect(avail[0].index).toBe(0);
        expect(avail[0].in_join.size).toBe(0);
        expect(avail[0].out_join.size).toBe(2);
    });

    it('two blocks', () => {
        const cfg: Block[] = [
            { index: 0, predecessors: [], successors: [1], body: new Set(['a']) },
            { index: 1, predecessors: [0], successors: [], body: new Set(['b']) },
        ];
        const avail: Availability[] = iterate(cfg);
        expect(avail.length).toBe(2);
        
        expect(avail[0].index).toBe(0);
        expect(avail[0].in_join.size).toBe(0);
        expect(avail[0].in_meet.size).toBe(0);
        expect(avail[0].out_join.size).toBe(1);
        expect(avail[0].out_join.has('a')).toBe(true);
        expect(avail[0].out_meet.size).toBe(1);
        expect(avail[0].out_meet.has('a')).toBe(true);

        expect(avail[1].index).toBe(1);
        expect(avail[1].in_join.size).toBe(1);
        expect(avail[1].in_meet.size).toBe(1);
        expect(avail[1].out_join.size).toBe(2);
        expect(avail[1].out_join.has('a')).toBe(true);
        expect(avail[1].out_join.has('b')).toBe(true);
        expect(avail[1].out_meet.size).toBe(2);
        expect(avail[1].out_meet.has('a')).toBe(true);
        expect(avail[1].out_meet.has('b')).toBe(true);
    });

    it('diamond', () => {
        // definitions in blocks:
        //
        //      a
        //     / \
        //    l   r
        //     \ /
        //      z
        //
        const cfg: Block[] = [
            { index: 0, predecessors: [], successors: [1,2], body: new Set(['a']) },
            { index: 1, predecessors: [0], successors: [3], body: new Set(['l']) },
            { index: 2, predecessors: [0], successors: [3], body: new Set(['r']) },
            { index: 3, predecessors: [1,2], successors: [], body: new Set(['z']) },
        ];
        const avail: Availability[] = iterate(cfg);
        expect(avail.length).toBe(4);

        expect(avail[0].in_join.size).toBe(0);
        expect(avail[0].in_meet.size).toBe(0);
        expect(avail[0].out_join.size).toBe(1);
        expect(avail[0].out_join.has('a')).toBe(true);
        expect(avail[0].out_meet.size).toBe(1);
        expect(avail[0].out_meet.has('a')).toBe(true);

        expect(avail[1].in_join.size).toBe(1);
        expect(avail[1].in_meet.size).toBe(1);
        expect(avail[1].out_join.size).toBe(2);
        expect(avail[1].out_join.has('a')).toBe(true);
        expect(avail[1].out_join.has('l')).toBe(true);
        expect(avail[1].out_meet.size).toBe(2);
        expect(avail[1].out_meet.has('a')).toBe(true);
        expect(avail[1].out_meet.has('l')).toBe(true);

        expect(avail[2].in_join.size).toBe(1);
        expect(avail[2].in_meet.size).toBe(1);
        expect(avail[2].out_join.size).toBe(2);
        expect(avail[2].out_join.has('a')).toBe(true);
        expect(avail[2].out_join.has('r')).toBe(true);
        expect(avail[2].out_meet.size).toBe(2);
        expect(avail[2].out_meet.has('a')).toBe(true);
        expect(avail[2].out_meet.has('r')).toBe(true);

        expect(avail[3].in_join.size).toBe(3);
        expect(avail[3].in_meet.size).toBe(1);
        expect(avail[3].out_join.size).toBe(4);
        expect(avail[3].out_join.has('a')).toBe(true);
        expect(avail[3].out_join.has('l')).toBe(true);
        expect(avail[3].out_join.has('r')).toBe(true);
        expect(avail[3].out_join.has('z')).toBe(true);
        expect(avail[3].out_meet.size).toBe(2);
        expect(avail[3].out_meet.has('a')).toBe(true);
        expect(avail[3].out_meet.has('z')).toBe(true);
    });
});
