import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { contains, Edge, reachable } from "./digraph-reachability.ts";

describe('one node with a self-cycle', () => {
    it('self-cycle', () => {
        const g: Edge[]  = [[0, 0],];

        const transitive_closure: Edge[] = reachable(g);
        expect(contains([0, 0], transitive_closure)).toEqual(true);
        expect(transitive_closure.length).toEqual(1);
    });

    it('two nodes with a single connecting edge', () => {
        const g: Edge[]  = [[0, 1],];

        const transitive_closure: Edge[] = reachable(g);
        expect(contains([0, 1], transitive_closure)).toEqual(true);
        expect(transitive_closure.length).toEqual(1);
    });

    it.skip('two strongly connected nodes', () => {
        const g: Edge[]  = [[0, 1],
                            [1, 0],];

        const transitive_closure: Edge[] = reachable(g);
        expect(contains([0, 0], transitive_closure)).toEqual(true);
        expect(contains([0, 1], transitive_closure)).toEqual(true);
        expect(contains([1, 0], transitive_closure)).toEqual(true);
        expect(contains([1, 1], transitive_closure)).toEqual(true); // problems
        expect(transitive_closure.length).toEqual(4);
    });

    it.skip('six nodes', () => {
        // The following digraph starts at node 0 and with the exception of
        // the back edge from 4 to 3, the arrows move downward toward node 5.
        //
        //        0
        //        |
        //        '
        //        1
        //      /   \
        //     '     '
        //    2       3 <---+
        //     \      |     |
        //      \     '     |
        //       \    4 ----+
        //        \   |
        //         '  '
        //           5
        //
        const g: Edge[]  = [[0, 1],
                            [1, 2],
                            [1, 3],
                            [2, 5],
                            [3, 4],
                            [4, 3],
                            [4, 5],];
        const transitive_closure: Edge[] = reachable(g);
        expect(contains([0, 1], transitive_closure)).toEqual(true);
        expect(contains([0, 2], transitive_closure)).toEqual(true);
        expect(contains([0, 3], transitive_closure)).toEqual(true);
        expect(contains([0, 4], transitive_closure)).toEqual(true);
        expect(contains([0, 5], transitive_closure)).toEqual(true);
        expect(contains([1, 2], transitive_closure)).toEqual(true);
        expect(contains([1, 3], transitive_closure)).toEqual(true);
        expect(contains([1, 4], transitive_closure)).toEqual(true);
        expect(contains([1, 5], transitive_closure)).toEqual(true);
        expect(contains([2, 5], transitive_closure)).toEqual(true);
        expect(contains([3, 3], transitive_closure)).toEqual(true); // had problems initially
        expect(contains([3, 4], transitive_closure)).toEqual(true);
        expect(contains([3, 5], transitive_closure)).toEqual(true);
        expect(contains([4, 3], transitive_closure)).toEqual(true);
        expect(contains([4, 4], transitive_closure)).toEqual(true); // problems
        expect(contains([4, 5], transitive_closure)).toEqual(true);
        expect(transitive_closure.length).toEqual(16);
    });
});

describe.skip('disjoint digraphs', () => {
    it('two nodes with self-cycles', () => {
        const g: Edge[]  = [[0, 0],
                            [1, 1],];

        const transitive_closure: Edge[] = reachable(g);
        expect(contains([0, 0], transitive_closure)).toEqual(true);
        expect(contains([1, 1], transitive_closure)).toEqual(true);
        expect(transitive_closure.length).toEqual(2);
    });

    it('one edge each', () => {
        const g: Edge[]  = [[0, 1],
                            [2, 3],];

        const transitive_closure: Edge[] = reachable(g);
        expect(contains([0, 1], transitive_closure)).toEqual(true);
        expect(contains([2, 3], transitive_closure)).toEqual(true);
        expect(transitive_closure.length).toEqual(2);
    });

    it('one edge each', () => {
        const g: Edge[]  = [[0, 1],
                            [1, 2],
                            [5, 6],
                            [6, 7],];

        const transitive_closure: Edge[] = reachable(g);
        expect(contains([0, 1], transitive_closure)).toEqual(true);
        expect(contains([0, 2], transitive_closure)).toEqual(true);
        expect(contains([1, 2], transitive_closure)).toEqual(true);
        expect(contains([5, 6], transitive_closure)).toEqual(true);
        expect(contains([5, 7], transitive_closure)).toEqual(true);
        expect(contains([6, 7], transitive_closure)).toEqual(true);
        expect(transitive_closure.length).toEqual(6);
    });
});