import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";
import { check_application, check_assignment } from "./checker.ts";
import { Arrow, Type } from "./types.ts";

describe('type checking', () => {
    it('Bool__assign__Bool', () => {
        const left: Type = { type: "Bool" } ;
        const right: Type = { type: "Bool" } ;
        expect(check_assignment(left, right)).toEqual(true);
    });

    it('Bool__assign__Int64', () => {
        const left: Type = { type: "Bool" } ;
        const right: Type = { type: "Int64" } ;
        expect(check_assignment(left, right)).toEqual(false);
    });

    it('Int64_to_Bool__applied__Int64', () => {
        const fn: Arrow   = { type: "Arrow", from: { type: "Int64" }, to: { type: "Bool"} };
        const arg: Type[] = [{ type: "Int64" }];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it('Int64_to_Bool__applied__Char8', () => {
        const fn: Arrow   = { type: "Arrow", from: { type: "Int64" }, to: { type: "Bool"} };
        const arg: Type[] = [{ type: "Char8" }];
        expect(check_application(fn, arg)).toEqual(false);
    });

    it('Int64_to_Int64_to_Bool__applied__Int64_Int64', () => {
        const fn: Arrow   = { type: "Arrow", from: { type: "Int64" }, to: { type: "Arrow", from: { type: "Int64" }, to: { type: "Bool"} } };
        const arg: Type[] = [{ type: "Int64" }, { type: "Int64" }];
        expect(check_application(fn, arg)).toEqual(true);
    });

    it.skip('Int64_to_Int64_to_Bool__applied__Int64_Bool', () => {
        const fn: Arrow   = { type: "Arrow", from: { type: "Int64" }, to: { type: "Arrow", from: { type: "Int64" }, to: { type: "Bool"} } };
        const arg: Type[] = [{ type: "Int64" }, { type: "Bool" }];
        expect(check_application(fn, arg)).toEqual(false);
    });
});
