import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { iterate, traverse } from "./availability.ts";
import { Availability, Block, Definition } from "./types.ts"

describe('block traversal', () => {
    it('empty block', () => {
        const block: Block = { index: 0, predecessors: [], successors: [], body: new Set() };
        const in_join:  Set<Definition> = new Set();
        const out_join: Set<Definition> = traverse(block, in_join);
        expect(out_join.size).toEqual(0);
    });

    it('block with two definitions', () => {
        const block: Block = { index: 0, predecessors: [], successors: [], body: new Set(['a', 'b']) };
        const in_join:  Set<Definition> = new Set();
        const out_join: Set<Definition> = traverse(block, in_join);
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
            { index: 0, predecessors: [], successors: [1], body: new Set(['x']) },
            { index: 1, predecessors: [0], successors: [], body: new Set(['a']) },
        ];
        const avail: Availability[] = iterate(cfg);
        expect(avail.length).toBe(2);
        expect(avail[0].index).toBe(0);
        expect(avail[0].in_join.size).toBe(0);
        expect(avail[0].out_join.size).toBe(1);
        expect(avail[1].index).toBe(1);
        // expect(avail[1].in_join.size).toBe(1);
        // expect(avail[1].out_join.size).toBe(2);  
    });
});
