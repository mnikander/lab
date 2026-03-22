import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { equivalent, Type } from "./types.ts"

describe('type equivalence', () => {
    it('Bool__equal__Bool', () => {
        const a: Type = ["Bool"];
        const b: Type = ["Bool"];
        expect(equivalent(a, b)).toBe(true);
    });

    it('Bool__unequal__Int64', () => {
        const a: Type = ["Bool"];
        const b: Type = ["Int64"];
        expect(equivalent(a, b)).toBe(false);
    });

    it('Bool_to_Bool__unequal__Bool', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = ["Bool"];
        expect(equivalent(a, b)).toBe(false);
    });

    it('Bool_to_Bool__unequal__Bool_to_Int64', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = [ "Arrow", ["Bool"], ["Int64"] ];
        expect(equivalent(a, b)).toBe(false);
    });

    it('Bool_to_Bool__equal__Bool_to_Bool', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        expect(equivalent(a, b)).toBe(true);
    });

    it('Bool_to_Bool__unequal__Bool_to_Bool_to_Bool', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = [ "Arrow", ["Bool"], [ "Arrow", ["Bool"], ["Bool"] ] ];
        expect(equivalent(a, b)).toBe(false);
    });

    it('Bool_to_Bool_to_Bool__equal__Bool_to_Bool_to_Bool', () => {
        const a: Type = [ "Arrow", ["Bool"], [ "Arrow", ["Bool"], ["Bool"] ] ];
        const b: Type = [ "Arrow", ["Bool"], [ "Arrow", ["Bool"], ["Bool"] ] ];
        expect(equivalent(a, b)).toBe(true);
    });
});
