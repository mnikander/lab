import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { equivalent, Type } from "./types.ts"

describe('simple type equivalence', () => {
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

describe('sum-type equivalence', () => {
    it('empty variants must be equivalent', () => {
        const a: Type = ["Variant", []];
        const b: Type = ["Variant", []];
        expect(equivalent(a, b)).toBe(true);
    });

    it('identical unary variants must be equivalent', () => {
        const a: Type = ["Variant", [["Bool"]]];
        const b: Type = ["Variant", [["Bool"]]];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different unary variants must NOT be equivalent', () => {
        const a: Type = ["Variant", [["Bool"]]];
        const b: Type = ["Variant", [["Int64"]]];
        expect(equivalent(a, b)).toBe(false);
    });
    
    it('identical binary variants must be equivalent', () => {
        const a: Type = ["Variant", [["Bool"], ["Int64"]]];
        const b: Type = ["Variant", [["Bool"], ["Int64"]]];
        expect(equivalent(a, b)).toBe(true);
    });

    it('reversed binary variants, must be equivalent', () => {
        const a: Type = ["Variant", [["Bool"], ["Int64"]]];
        const b: Type = ["Variant", [["Int64"], ["Bool"]]];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different binary variants must NOT be equivalent', () => {
        const a: Type = ["Variant", [["Bool"], ["Int64"]]];
        const b: Type = ["Variant", [["Bool"], ["Char8"]]];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different-size variants, must NOT be equivalent', () => {
        const a: Type = ["Variant", [["Bool"]]];
        const b: Type = ["Variant", [["Bool"], ["Int64"]]];
        expect(equivalent(a, b)).toBe(false);
    });
});

describe('product-type equivalence', () => {
    it('empty tuples must be equivalent', () => {
        const a: Type = ["Tuple", []];
        const b: Type = ["Tuple", []];
        expect(equivalent(a, b)).toBe(true);
    });

    it('identical unary tuples must be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"]]];
        const b: Type = ["Tuple", [["Bool"]]];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different unary tuples must NOT be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"]]];
        const b: Type = ["Tuple", [["Int64"]]];
        expect(equivalent(a, b)).toBe(false);
    });

    it('identical binary tuples must be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"], ["Int64"]]];
        const b: Type = ["Tuple", [["Bool"], ["Int64"]]];
        expect(equivalent(a, b)).toBe(true);
    });

    it('reversed binary tuples, must NOT be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"], ["Int64"]]];
        const b: Type = ["Tuple", [["Int64"], ["Bool"]]];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different binary tuples must NOT be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"], ["Int64"]]];
        const b: Type = ["Tuple", [["Bool"], ["Char8"]]];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different-size tuples, must NOT be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"]]];
        const b: Type = ["Tuple", [["Bool"], ["Int64"]]];
        expect(equivalent(a, b)).toBe(false);
    });
});
