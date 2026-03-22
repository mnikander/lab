// Copyright (c) 2026 Marco Nikander

import { Arrow, equivalent, flatten_arrow, get_type, Simple } from "./types.ts";

export function check_assignment(left: Simple, right: Simple): boolean {
    return equivalent(left, right);
}

export function check_application(fun: Arrow, args: Simple[]): boolean {
    const f: Simple[] = flatten_arrow(fun);
    if (f.length - 1 === args.length) { //f.length >= 2 && 
        for (let i = 0; i < args.length; ++i) {
            if (get_type(f[i]) !== get_type(args[i])) {
                return false;
            }
        }
        return true;
    }
    else {
        return false;
    }
}
