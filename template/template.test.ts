import { describe, it } from "jsr:@std/testing@1.0.16/bdd";
import { expect } from "jsr:@std/expect@1.0.17";

describe('unit testing', () => {
    it('tautology', () => {
        expect(true).toEqual(true);
    });
});
