// Copyright (c) 2026 Marco Nikander

export enum Get       { from = 0, to = 1};
export type Edge    = [number, number];

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

function attempt_join(a: Edge, b: Edge): undefined | Edge {    
    if (a[Get.to] === b[Get.from]) {
        return [a[Get.from], b[Get.to]];
    }
    else {
        return undefined;
    }
}

function equal(a: Edge, b: Edge): boolean {
    return a[Get.from] === b[Get.from] && a[Get.to] === b[Get.to];
}

export function contains(e: Edge, edges: Edge[]): boolean {
    return edges.find((other: Edge) => { return equal(e, other); }) !== undefined;
}
