import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { equivalent, Type } from "./types.ts"

describe('type equivalence', () => {
    it('bool_equal_bool', () => {
        const a: Type = { type: "Bool" };
        const b: Type = { type: "Bool" };
        expect(equivalent(a, b)).toBe(true);
    });

    it('bool_not_equal_int64', () => {
        const a: Type = { type: "Bool" };
        const b: Type = { type: "Int64" };
        expect(equivalent(a, b)).toBe(false);
    });
});
