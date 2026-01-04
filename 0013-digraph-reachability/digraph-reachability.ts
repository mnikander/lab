// Copyright (c) 2026 Marco Nikander

import { attempt_join, Edge, Key, make_key } from "./edge.ts";

export function reachable(edges: readonly Edge[]): Edge[] {
    const known: Set<Key> = new Set();
    const old: Edge[]     = [];
    let delta: Edge[]     = [];

    edges.forEach((e: Edge) => insert(e, delta, known));
    
    while(delta.length > 0) {
        const element: Edge = (delta.shift() as Edge);
        old.push(element);
        
        for (const o of old) {
            // Join in both directions, if possible. This is vital
            // for cases where there are edges (a, b) and (b, a) and
            // there are thus _two_ new edges: (a, a) and (b, b).
            const a = attempt_join(o, element);
            const b = attempt_join(element, o);
            delta   = insert(a, delta, known);
            delta   = insert(b, delta, known);
        }
    }
    return old;
}

// checks if an edge is already known, if not: add it to 'delta' and the 'known' set
function insert(edge: undefined | Edge, delta: Edge[], known: Set<Key>): Edge[] {
    if (edge) {
        const key: Key = make_key(edge);
        if(!known.has(key)) {
            known.add(key);
            delta.push(edge);
        }
    }
    return delta;
}
