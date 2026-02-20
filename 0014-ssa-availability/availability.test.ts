import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { Availability, Block, Definition, traverse } from "./availability.ts";

describe('block traversal', () => {
    it('empty block', () => {
        const block: Block = {name: 'Entry', predecessors: [], successors: [], body: new Set()};
        const before: Availability = { name: 'Entry', in: new Set(), out: new Set() };
        const after: Availability  = traverse(block, before);
        expect(after.name).toEqual('Entry');
        expect(after.in.size).toEqual(0);
        expect(after.out.size).toEqual(0);
    });

    it('block with two definitions', () => {
        const defs: Set<Definition> = new Set(['a', 'b']);
        const block: Block = {name: 'Entry', predecessors: [], successors: [], body: defs};
        const before: Availability = { name: 'Entry', in: new Set(), out: new Set() };
        const after: Availability  = traverse(block, before);
        expect(after.name).toEqual('Entry');
        expect(after.in.size).toEqual(0);
        expect(after.out.size).toEqual(2);
    });
});
