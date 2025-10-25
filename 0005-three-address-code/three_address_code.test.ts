import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { evaluate, Instruction } from "./three_address_code.ts";

describe('constants and exit', () => {
    it('must throw error on empty input', () => {
        const input: Instruction[] = [];
        expect(() => evaluate(input)).toThrow();
    });

    it('must evaluate a constant', () => {
        const input: Instruction[] = [
            { tag: 'Const', target: 0, constant: 42 },
            { tag: 'Exit',  result: 0 },
        ];
        expect(evaluate(input)).toBe(42);
    });
});

describe('arithmetic operations', () => {
    it('must evaluate integer addition', () => {
        const input: Instruction[] = [
            { tag: 'Const', target: 0, constant: 1 },
            { tag: 'Const', target: 1, constant: 2 },
            { tag: 'Add',   target: 2, left: 0, right: 1 },
            { tag: 'Exit',  result: 2 },
        ];
        expect(evaluate(input)).toBe(3);
    });
});
