import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { lex, parse } from './table_driven_parser.ts';

describe('balanced parentheses', () => {

    it('empty', () => {
        expect(parse(lex(''))).toBe(true);
    });
    it('()', () => {
        expect(parse(lex('()'))).toBe(true);
    });
    it('()()', () => {
        expect(parse(lex('()()'))).toBe(true);
    });
    it('(())', () => {
        expect(parse(lex('(())'))).toBe(true);
    });
});

describe('must reject unbalanced parentheses', () => {
    it('(', () => {
        expect(parse(lex('('))).toBe(false);
    });

    it(')', () => {
        expect(parse(lex(')'))).toBe(false);
    });

    it('((', () => {
        expect(parse(lex('(('))).toBe(false);
    });
    
    it(')(', () => {
        expect(parse(lex(')('))).toBe(false);
    });
    
    it('))', () => {
        expect(parse(lex('))'))).toBe(false);
    });

    it('(((', () => {
        expect(parse(lex('((('))).toBe(false);
    });

    it('(()', () => {
        expect(parse(lex('(()'))).toBe(false);
    });

    it('()(', () => {
        expect(parse(lex('()('))).toBe(false);
    });

    it('())', () => {
        expect(parse(lex('())'))).toBe(false);
    });

    it(')((', () => {
        expect(parse(lex(')(('))).toBe(false);
    });

    it(')()', () => {
        expect(parse(lex(')()'))).toBe(false);
    });

    it('))(', () => {
        expect(parse(lex('))('))).toBe(false);
    });

    it(')))', () => {
        expect(parse(lex(')))'))).toBe(false);
    });
});
