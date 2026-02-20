import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { Availability, Block, Definition, iterate, traverse } from "./availability.ts";

describe('block traversal', () => {
    it('empty block', () => {
        const block: Block = { name: 'Entry', predecessors: [], successors: [], body: new Set() };
        const in_set:  Set<Definition> = new Set();
        const out_set: Set<Definition> = traverse(block, in_set);
        expect(out_set.size).toEqual(0);
    });

    it('block with two definitions', () => {
        const block: Block = { name: 'Entry', predecessors: [], successors: [], body: new Set(['a', 'b']) };
        const in_set:  Set<Definition> = new Set();
        const out_set: Set<Definition> = traverse(block, in_set);
        expect(out_set.size).toEqual(2);
    });
});

describe('create availability', () => {
    it('one block without variables', () => {
        const cfg: Block[] = [
            { name: 'Entry', predecessors: [], successors: [], body: new Set() },
        ];
        const avail: Availability[] = iterate(cfg);
        expect(avail.length).toBe(1);
        expect(avail[0].name).toBe('Entry');
        expect(avail[0].in_set.size).toBe(0);
        expect(avail[0].out_set.size).toBe(0);
    });

    it('one block with two variables', () => {
        const cfg: Block[] = [
            { name: 'Entry', predecessors: [], successors: [], body: new Set(['a', 'b']) },
        ];
        const avail: Availability[] = iterate(cfg);
        expect(avail.length).toBe(1);
        expect(avail[0].name).toBe('Entry');
        expect(avail[0].in_set.size).toBe(0);
        expect(avail[0].out_set.size).toBe(2);
    });
});
