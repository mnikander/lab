// Copyright (c) 2026 Marco Nikander

import { Arrow, equivalent, Type } from "./types.ts";

export function check_assignment(left: Type, right: Type): boolean {
    return equivalent(left, right);
}

export function check_application(fun: Arrow, args: Type[]): boolean {
    return impl(fun.from, args);

    function impl(item: Type, args: Type[]): boolean {
        if (item.type === "Arrow") {
            return impl(item.from, args) && impl(item.to, args);
        }
        else {
            return item.type === args.shift()?.type;
        }
    }
}
