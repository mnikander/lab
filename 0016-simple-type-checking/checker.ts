// Copyright (c) 2026 Marco Nikander

import { Arrow, equivalent, equivalent_sequence, flatten_arrow, Simple, Type } from "./types.ts";

export function check_assignment(left: Simple, right: Simple): boolean {
    return equivalent(left, right);
}

export function check_application(fun: Arrow, args: Type[]): boolean {
    const f: Type[] = flatten_arrow(fun).slice(0, -1); // this slice drops the result-type
    return equivalent_sequence(f, args);
}
