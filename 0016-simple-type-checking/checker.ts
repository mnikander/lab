// Copyright (c) 2026 Marco Nikander

import { Arrow, equivalent, get_type, is_arrow, Simple, Type } from "./types.ts";

export function check_assignment(left: Simple, right: Simple): boolean {
    return equivalent(left, right);
}

export function check_application(fun: Arrow, args: Type[]): boolean {
    return impl(fun[1], args);

    function impl(item: Type, args: Type[]): boolean {
        if (is_arrow(item)) {
            return impl(item[1], args) && impl(item[1], args);
        }
        else {
            let a: undefined | Type = args.shift();
            if (a) {
                return get_type(item) === get_type(a);
            }
            else {
                return false;
            }
        }
    }
}
