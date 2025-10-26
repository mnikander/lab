// Copyright (c) 2025 Marco Nikander

export type Instruction = Add | Const| Label | Jump | Branch | Exit;
export type Register    = number;
export type RawValue    = boolean | number;
export type Value       = { tag: 'Value', value: RawValue };
export type Const       = { tag: 'Const', target: Register, constant: RawValue };
export type Add         = { tag: 'Add', target: Register, left: Register, right: Register };
export type Jump        = { tag: 'Jump', label: string };
export type Label       = { tag: 'Label', label: string };
export type Branch      = { tag: 'Branch', condition: Register, label: string };
export type Exit        = { tag: 'Exit', result: Register };
type Frame              = { register: (undefined | Value)[] };

export function evaluate(instructions: readonly Instruction[]): RawValue {

    let stack: Frame[] = [ {register: []} ];
    const top: undefined | Frame = stack[stack.length - 1];
    let pc: number = 0;

    while (pc < instructions.length) {
        if (top === undefined) throw Error('Bug: no valid stack frame');
        const instruc: Instruction = instructions[pc];

        switch (instruc.tag) {
            case 'Const':
                top.register[instruc.target] = { tag: 'Value', value: instruc.constant };
                pc++;
                break;
            case 'Add':
                top.register[instruc.target] = { tag: 'Value', value: assert_number(top.register[instruc.left]) + assert_number(top.register[instruc.right]) };
                pc++;
                break;
            case 'Label':
                pc++;
                break;
            case 'Jump':
                pc = find_label(instructions, instruc.label);
                break;
            case 'Branch':
                if (assert_boolean(top.register[instruc.condition])) {
                    pc = find_label(instructions, instruc.label);
                }
                else {
                    pc++;
                }
                break;
            case 'Exit':
                return assert_defined(top.register[instruc.result]).value;
            default:
                throw Error(`Unhandled instruction type '${(instruc as Instruction).tag}'`);
        }
    }
    throw Error(`Reached end of instructions without an 'Exit' command`);
}

function assert_boolean(value: undefined | Value): boolean {
    if (value === undefined || typeof value.value !== 'boolean') {
        throw Error('Expected value to contain a boolean');
    }
    else {
        return value.value;
    }
}

function assert_number(value: undefined | Value): number {
    if (value === undefined || typeof value.value !== 'number') {
        throw Error('Expected value to contain a number');
    }
    else {
        return value.value;
    }
}

function assert_defined<T> (value: undefined | T): T {
    if (value === undefined) {
        throw Error('Expected a defined value');
    }
    else {
        return value;
    }
}

function find_label(instructions: readonly Instruction[], label: string): number {
    return instructions.findIndex((i: Instruction) => { return i.tag === 'Label' && i.label === label; });
}
