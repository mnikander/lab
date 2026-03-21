import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { equivalent, Type } from "./types.ts"

describe('type equivalence', () => {
    it('Bool__equal__Bool', () => {
        const a: Type = { type: "Bool" };
        const b: Type = { type: "Bool" };
        expect(equivalent(a, b)).toBe(true);
    });

    it('Bool__unequal__Int64', () => {
        const a: Type = { type: "Bool" };
        const b: Type = { type: "Int64" };
        expect(equivalent(a, b)).toBe(false);
    });

    it('Bool_to_Bool__unequal__Bool', () => {
        const a: Type = { type: "Arrow", from: { type: "Bool"}, to: { type: "Bool"} };
        const b: Type = { type: "Bool" };
        expect(equivalent(a, b)).toBe(false);
    });

    it('Bool_to_Bool__unequal__Bool_to_Int64', () => {
        const a: Type = { type: "Arrow", from: { type: "Bool"}, to: { type: "Bool"} };
        const b: Type = { type: "Arrow", from: { type: "Bool"}, to: { type: "Int64"} };
        expect(equivalent(a, b)).toBe(false);
    });

    it('Bool_to_Bool__equal__Bool_to_Bool', () => {
        const a: Type = { type: "Arrow", from: { type: "Bool"}, to: { type: "Bool"} };
        const b: Type = { type: "Arrow", from: { type: "Bool"}, to: { type: "Bool"} };
        expect(equivalent(a, b)).toBe(true);
    });
});
