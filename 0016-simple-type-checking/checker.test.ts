import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { check_application, check_assignment } from "./checker.ts";
import { Arrow, Simple, Type } from "./types.ts";

describe('check assignment', () => {
    it('Bool__assign__Bool', () => {
        const left: Simple  = ["Bool"] ;
        const right: Simple = ["Bool"] ;
        expect(check_assignment(left, right)).toEqual(true);
    });

    it('Bool__assign__Int64', () => {
        const left: Simple  = ["Bool"] ;
        const right: Simple = ["Int64"] ;
        expect(check_assignment(left, right)).toEqual(false);
    });
});

describe('check first-order functions', () => {
    it('Int64_to_Bool__applied__Int64', () => {
        const fn: Arrow     = ["Arrow", ["Int64"], ["Bool"] ];
        const arg: Simple[] = [["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('Int64_to_VariantBoolInt64__applied__Int64', () => {
        const fn: Arrow     = ["Arrow", ["Int64"], ["Variant", [["Bool"], ["Int64"]]]];
        const arg: Simple[] = [["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });
    
    it('Int64_to_TupleBoolInt64__applied__Int64', () => {
        const fn: Arrow     = ["Arrow", ["Int64"], ["Tuple", [["Bool"], ["Int64"]]]];
        const arg: Simple[] = [["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('Int64_to_Bool__applied__no_arguments', () => {
        const fn: Arrow     = ["Arrow", ["Int64"], ["Bool"] ];
        const arg: Simple[] = [];
        expect(check_application(fn, arg)).toEqual(false);
    });

    it('Int64_to_Bool__applied__Char8', () => {
        const fn: Arrow     = ["Arrow", ["Int64"], ["Bool"] ];
        const arg: Simple[] = [["Char8"]];
        expect(check_application(fn, arg)).toEqual(false);
    });

    it('Int64_to_Int64_to_Bool__applied__Int64_Int64', () => {
        const fn: Arrow     = ["Arrow", ["Int64"], ["Arrow", ["Int64"], ["Bool"] ] ];
        const arg: Simple[] = [["Int64"], ["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('Int64_to_Int64_to_Bool__applied__Int64_Bool', () => {
        const fn: Arrow     = ["Arrow", ["Int64"], ["Arrow", ["Int64"], ["Bool"] ] ];
        const arg: Simple[] = [["Int64"], ["Bool"]];
        expect(check_application(fn, arg)).toEqual(false);
    });
});

describe('check higher-order functions', () => {
    it('Int64toBool_to_Int64_to_Bool__applied__Int64', () => {
        // this is a higher-order function like 'map', but on one element:
        // fn : (Int64 -> Bool) -> Int64 -> Bool
        // note that arrows are right-associative, to this is equivalent to:
        // fn : (Int64 -> Bool) -> (Int64 -> Bool)
        const fn: Arrow   = ["Arrow", ["Arrow", ["Int64"], ["Bool"]], ["Arrow", ["Int64"], ["Bool"]]];
        const arg: Type[] = [["Arrow", ["Int64"], ["Bool"]], ["Int64"]];
        expect(check_application(fn, arg)).toEqual(true);
    });

        it('Int64toBool_to_Int64_to_Bool__applied__Int64', () => {
        // this is a higher-order function like 'map', but on one element:
        // fn : Int64 -> (Int64 -> Bool) -> Bool
        // note that arrows are right-associative, to this is equivalent to:
        // fn : Int64 -> ((Int64 -> Bool) -> Bool)
        const fn: Arrow   = ["Arrow", ["Int64"], ["Arrow", ["Arrow", ["Int64"], ["Bool"]], ["Bool"]]];
        const arg: Type[] = [["Int64"], ["Arrow", ["Int64"], ["Bool"]]];
        expect(check_application(fn, arg)).toEqual(true);
    });
});
