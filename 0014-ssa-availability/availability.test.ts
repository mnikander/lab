import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { Block, Definition, traverse } from "./availability.ts";

describe('block traversal', () => {
    it('empty block', () => {
        const block: Block = {name: 'Entry', predecessors: [], successors: [], body: new Set()};
        const in_set:  Set<Definition> = new Set();
        const out_set: Set<Definition> = traverse(block, in_set);
        expect(out_set.size).toEqual(0);
    });

    it('block with two definitions', () => {
        const defs: Set<Definition> = new Set(['a', 'b']);
        const block: Block = {name: 'Entry', predecessors: [], successors: [], body: defs};
        const in_set:  Set<Definition> = new Set();
        const out_set: Set<Definition> = traverse(block, in_set);
        expect(out_set.size).toEqual(2);
    });
});
