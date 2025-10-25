// Copyright (c) 2025 Marco Nikander

import { match } from "jsr:@gabriel/ts-pattern";

export type Instruction = Add | Const | Exit;
export type Register    = number;
export type RawValue    = boolean | number;
export type Value       = { tag: 'Value', value: RawValue };
export type Const       = { tag: 'Const', target: Register, constant: RawValue };
export type Add         = { tag: 'Add', target: Register, left: Register, right: Register };
export type Exit        = { tag: 'Exit', result: Register };
type Frame              = { register: (undefined | Value)[] };

export function evaluate(instructions: readonly Instruction[]): RawValue {

    let stack: Frame[] = [ {register: []} ];
    let exit: undefined | Value = undefined;
    const top: undefined | Frame = stack[stack.length - 1];
    if (top === undefined) throw Error('Bug: no valid stack frame');

    for (const instr of instructions) {
        match(instr)
            .with({ tag: 'Const' }, ({ target, constant }) => {
                top.register[target] = { tag: 'Value', value: constant };
            })
            .with({ tag: 'Add' }, ({ target, left, right }) => {
                if (top.register[left] === undefined
                || top.register[right] === undefined
                || typeof top.register[left].value !== 'number'
                || typeof top.register[right].value !== 'number') {
                    throw new Error('Add expects numeric operands');
                }
                else {
                    top.register[target] = { tag: 'Value', value: top.register[left].value + top.register[right].value };
                }
            })
            .with({ tag: 'Exit' }, ({ result }) => {
                if(top.register[result] === undefined) {
                    throw Error('Result register is undefined');
                }
                exit = top.register[result];
            })
            .exhaustive();
    }

    // TODO: Why is this hack necessary to satisfy the type checker? 
    exit = exit as undefined | Value;
    // Without it, the type checker narrows the type of 'exit' to undefined. It doesn't see the possible assignment in the match.
    // Perhaps match doesn't work with side-effects, and I really should use returns within match. See notes in README.

    if (exit === undefined) {
        throw Error('Reached end of program without an exit instruction');
    }
    else {
        return exit.value;
    }
}
