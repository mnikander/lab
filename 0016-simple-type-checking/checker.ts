// Copyright (c) 2026 Marco Nikander

import { Arrow, equivalent, equivalent_array, flatten_arrow, Simple, Type } from "./types.ts";

export function check_assignment(left: Simple, right: Simple): boolean {
    return equivalent(left, right);
}

export function check_application(fun: Arrow, args: Type[]): boolean {
    const f: Type[] = flatten_arrow(fun).slice(0, -1);
    return equivalent_array(f, args);
}
