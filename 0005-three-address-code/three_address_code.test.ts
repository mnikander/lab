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

describe('copying of registers', () => {
    it('must copy a constant', () => {
        const input: Instruction[] = [
            { tag: 'Const', target: 0, constant: 42 },
            { tag: 'Copy',  target: 1, source: 0 },
            { tag: 'Exit',  result: 1 },
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

describe('labels, jump, and branch', () => {
    it('must skip over labels as if they are a "no-op"', () => {
        const input: Instruction[] = [
            { tag: 'Const', target: 0, constant: 1 },
            { tag: 'Label', label: 'First'},
            { tag: 'Const', target: 1, constant: 2 },
            { tag: 'Label', label: 'Second'},
            { tag: 'Add',   target: 2, left: 0, right: 1 },
            { tag: 'Label', label: 'Third'},
            { tag: 'Exit',  result: 2 },
        ];
        expect(evaluate(input)).toBe(3);
    });

    it('must execute the correct line of code after an unconditional jump ', () => {
        const input: Instruction[] = [
            { tag: 'Jump',  label: 'Second'},
            { tag: 'Label', label: 'First'},
            { tag: 'Const', target: 1, constant: 1 },
            { tag: 'Label', label: 'Second'},
            { tag: 'Const', target: 1, constant: 2 },
            { tag: 'Exit',  result: 1 },
        ];
        expect(evaluate(input)).toBe(2);
    });

    it('must not branch when condition is false', () => {
        const input: Instruction[] = [
            { tag: 'Const',  target: 0, constant: false },
            { tag: 'Const',  target: 1, constant: 1 },
            { tag: 'Const',  target: 2, constant: 2 },
            { tag: 'Const',  target: 3, constant: 4 },
            { tag: 'Branch', condition: 0, label: 'Else' },
            { tag: 'Add',    target: 4, left: 1, right: 2 },
            { tag: 'Jump',   label: 'End' },
            { tag: 'Label',  label: 'Else' },
            { tag: 'Add',    target: 4, left: 2, right: 3 },
            { tag: 'Label',  label: 'End'},
            { tag: 'Exit',   result: 4 },
        ];
        expect(evaluate(input)).toBe(3);
    });

    it('must branch when condition is true', () => {
        const input: Instruction[] = [
            { tag: 'Const',  target: 0, constant: true },
            { tag: 'Const',  target: 1, constant: 1 },
            { tag: 'Const',  target: 2, constant: 2 },
            { tag: 'Const',  target: 3, constant: 4 },
            { tag: 'Branch', condition: 0, label: 'Else' },
            { tag: 'Add',    target: 4, left: 1, right: 2 },
            { tag: 'Jump',   label: 'End' },
            { tag: 'Label',  label: 'Else' },
            { tag: 'Add',    target: 4, left: 2, right: 3 },
            { tag: 'Label',  label: 'End'},
            { tag: 'Exit',   result: 4 },
        ];
        expect(evaluate(input)).toBe(6);
    });
});
