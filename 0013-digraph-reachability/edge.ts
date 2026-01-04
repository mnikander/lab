// Copyright (c) 2026 Marco Nikander

export type Edge = [number, number];

export function start(edge: Edge): number {
    return edge[0];
}

export function end(edge: Edge): number {
    return edge[1];
}

export type Key = `${number},${number}`;

export function make_key([a, b]: Edge): Key {
    return `${a},${b}`;
}

export function contains(e: Edge, edges: readonly Edge[]): boolean {
    return edges.find((other: Edge) => { return equal(e, other); }) !== undefined;
}

export function equal(a: Edge, b: Edge): boolean {
    return start(a) === start(b) && end(a) === end(b);
}

export function attempt_join(a: Edge, b: Edge): undefined | Edge {    
    if (end(a) === start(b)) {
        return [start(a), end(b)];
    }
    else {
        return undefined;
    }
}
