import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { equivalent, Type } from "./types.ts"

describe('simple-type equivalence', () => {
    it('identical types must be equivalent', () => {
        const a: Type = ["Bool"];
        const b: Type = ["Bool"];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different types must NOT be equivalent', () => {
        const a: Type = ["Bool"];
        const b: Type = ["Int64"];
        expect(equivalent(a, b)).toBe(false);
    });
});

describe('arrow-type equivalence', () => {
    it('arrow type and simple types must NOT be equivalent', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = ["Bool"];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different arrow types must NOT be equivalent', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = [ "Arrow", ["Bool"], ["Int64"] ];
        expect(equivalent(a, b)).toBe(false);
    });

    it('identical arrow types must be equivalent', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different arity arrow types must NOT be equivalent', () => {
        const a: Type = [ "Arrow", ["Bool"], ["Bool"] ];
        const b: Type = [ "Arrow", ["Bool"], [ "Arrow", ["Bool"], ["Bool"] ] ];
        expect(equivalent(a, b)).toBe(false);
    });

    it('identical nested arrow types must be equivalent', () => {
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

    it('reversed binary variants must be equivalent', () => {
        const a: Type = ["Variant", [["Bool"], ["Int64"]]];
        const b: Type = ["Variant", [["Int64"], ["Bool"]]];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different binary variants must NOT be equivalent', () => {
        const a: Type = ["Variant", [["Bool"], ["Int64"]]];
        const b: Type = ["Variant", [["Bool"], ["Char8"]]];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different-size variants must NOT be equivalent', () => {
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

    it('reversed binary tuples must NOT be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"], ["Int64"]]];
        const b: Type = ["Tuple", [["Int64"], ["Bool"]]];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different binary tuples must NOT be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"], ["Int64"]]];
        const b: Type = ["Tuple", [["Bool"], ["Char8"]]];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different-size tuples must NOT be equivalent', () => {
        const a: Type = ["Tuple", [["Bool"]]];
        const b: Type = ["Tuple", [["Bool"], ["Int64"]]];
        expect(equivalent(a, b)).toBe(false);
    });
});

describe('array-type equivalence', () => {
    it('empty arrays must be equivalent', () => {
        const a: Type = ["Array", ["Bottom"], 0];
        const b: Type = ["Array", ["Bottom"], 0];
        expect(equivalent(a, b)).toBe(true);
    });

    it('identical unary arrays must be equivalent', () => {
        const a: Type = ["Array", ["Bool"], 1];
        const b: Type = ["Array", ["Bool"], 1];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different unary arrays must NOT be equivalent', () => {
        const a: Type = ["Array", ["Bool"], 1];
        const b: Type = ["Array", ["Int64"], 1];
        expect(equivalent(a, b)).toBe(false);
    });

    it('identical binary arrays must be equivalent', () => {
        const a: Type = ["Array", ["Bool"], 2];
        const b: Type = ["Array", ["Bool"], 2];
        expect(equivalent(a, b)).toBe(true);
    });

    it('different binary arrays must NOT be equivalent', () => {
        const a: Type = ["Array", ["Bool"], 2];
        const b: Type = ["Array", ["Int64"], 2];
        expect(equivalent(a, b)).toBe(false);
    });

    it('different-size arrays must NOT be equivalent', () => {
        const a: Type = ["Array", ["Bool"], 1];
        const b: Type = ["Array", ["Bool"], 2];
        expect(equivalent(a, b)).toBe(false);
    });
});
