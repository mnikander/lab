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
            const j = attempt_join(o, element);
            if(j && !contains(j, old) && !contains(j, delta)) {
                delta.push(j);
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
