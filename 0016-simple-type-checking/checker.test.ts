import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { check_application, check_assignment } from "./checker.ts";
import { Arrow, Simple, Type } from "./types.ts";

describe('assignment of', () => {
    it('matching simple types must type check', () => {
        const left: Simple  = ["Bool"] ;
        const right: Simple = ["Bool"] ;
        expect(check_assignment(left, right)).toEqual(true);
    });

    it('mismatching simple types must NOT type check', () => {
        const left: Simple  = ["Bool"] ;
        const right: Simple = ["Int64"] ;
        expect(check_assignment(left, right)).toEqual(false);
    });
});

describe('application of first-order functions to', () => {
    it('matching arguments must type check', () => {
        const fn: Arrow   = ["Arrow", ["Int64"], ["Bool"] ];
        const arg: Type[] = [["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('mismatching argument must NOT type check', () => {
        const fn: Arrow   = ["Arrow", ["Int64"], ["Bool"] ];
        const arg: Type[] = [["Char8"]];
        expect(check_application(fn, arg)).toEqual(false);
    });

    it('missing arguments must NOT type check', () => {
        const fn: Arrow   = ["Arrow", ["Int64"], ["Bool"] ];
        const arg: Type[] = [];
        expect(check_application(fn, arg)).toEqual(false);
    });

    it('excess arguments must NOT type check', () => {
        const fn: Arrow   = ["Arrow", ["Int64"], ["Bool"] ];
        const arg: Type[] = [["Int64"], ["Int64"]];
        expect(check_application(fn, arg)).toEqual(false);
    });

    it('matching binary arguments must type check', () => {
        const fn: Arrow   = ["Arrow", ["Int64"], ["Arrow", ["Int64"], ["Bool"] ] ];
        const arg: Type[] = [["Int64"], ["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('mismatching binary arguments must NOT type check', () => {
        const fn: Arrow   = ["Arrow", ["Int64"], ["Arrow", ["Int64"], ["Bool"] ] ];
        const arg: Type[] = [["Int64"], ["Bool"]];
        expect(check_application(fn, arg)).toEqual(false);
    });

    it('matching variants must type check', () => {
        const fn: Arrow   = ["Arrow", ["Variant", [["Bool"], ["Int64"]]], ["Int64"]];
        const arg: Type[] = [["Variant", [["Bool"], ["Int64"]]]];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('mismatching variants must NOT type check', () => {
        const fn: Arrow   = ["Arrow", ["Variant", [["Bool"], ["Int64"]]], ["Int64"]];
        const arg: Type[] = [["Variant", [["Unit"], ["Top"]]]];
        expect(check_application(fn, arg)).toEqual(false);
    });
    
    it('matching tuples must type check', () => {
        const fn: Arrow   = ["Arrow", ["Tuple", [["Bool"], ["Int64"]]], ["Int64"]];
        const arg: Type[] = [["Tuple", [["Bool"], ["Int64"]]]];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('mismatching tuples must NOT type check', () => {
        const fn: Arrow   = ["Arrow", ["Tuple", [["Bool"], ["Int64"]]], ["Int64"]];
        const arg: Type[] = [["Tuple", [["Unit"], ["Top"]]]];
        expect(check_application(fn, arg)).toEqual(false);
    });
});

describe('check higher-order functions', () => {
    it('matching function arguments and simple arguments must type check', () => {
        // this is a higher-order function like 'map', but on one element:
        // fn : (Int64 -> Bool) -> Int64 -> Bool
        // note that arrows are right-associative, to this is equivalent to:
        // fn : (Int64 -> Bool) -> (Int64 -> Bool)
        const fn: Arrow   = ["Arrow", ["Arrow", ["Int64"], ["Bool"]], ["Arrow", ["Int64"], ["Bool"]]];
        const arg: Type[] = [["Arrow", ["Int64"], ["Bool"]], ["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });

        it('matching simple arguments and function arguments must type check', () => {
        // this is a higher-order function like 'map', but on one element:
        // fn : Int64 -> (Int64 -> Bool) -> Bool
        // note that arrows are right-associative, to this is equivalent to:
        // fn : Int64 -> ((Int64 -> Bool) -> Bool)
        const fn: Arrow   = ["Arrow", ["Int64"], ["Arrow", ["Arrow", ["Int64"], ["Bool"]], ["Bool"]]];
        const arg: Type[] = [["Int64"], ["Arrow", ["Int64"], ["Bool"]]];
        expect(check_application(fn, arg)).toEqual(true);
    });
});
