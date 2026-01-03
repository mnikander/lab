// Copyright (c) 2026 Marco Nikander

export type Edge = [number, number];
export function start(edge: Edge): number { return edge[0]; }
export function end(edge: Edge): number { return edge[1]; }

export function reachable(edges: readonly Edge[]): Edge[] {
    const old  : Edge[] = [];
    const delta: Edge[] = [];

    edges.forEach((e: Edge) => delta.push(e));
    
    while(delta.length > 0) {
        const element: Edge = (delta.shift() as Edge);
        old.push(element);
        
        for (const o of old) {
            // Join in both directions, if possible. This is vital
            // for cases where there are edges (a, b) and (b, a) and
            // there are thus _two_ new edges: (a, a) and (b, b).
            const a = attempt_join(o, element);
            if(a && !contains(a, old) && !contains(a, delta)) {
                delta.push(a);
            }
            
            const b = attempt_join(element, o);
            if(b && !contains(b, old) && !contains(b, delta)) {
                delta.push(b);
            }
        }
    }
    return old;
}

export function contains(e: Edge, edges: Edge[]): boolean {
    return edges.find((other: Edge) => { return equal(e, other); }) !== undefined;
}

function equal(a: Edge, b: Edge): boolean {
    return start(a) === start(b) && end(a) === end(b);
}

function attempt_join(a: Edge, b: Edge): undefined | Edge {    
    if (end(a) === start(b)) {
        return [start(a), end(b)];
    }
    else {
        return undefined;
    }
}
