// Copyright (c) 2026 Marco Nikander

export type Program    = readonly Function[];
export type Function   = { name: Label, params: number[], blocks: Block[] };
export type Block      = { name: Label, lines: Line[], terminator: Terminator };

export type Line       = Define | Use | Free ;
export type Define     = [ tag: 'define', variable: number ];
export type Use        = [ tag: 'use',    variable: number ];
export type Free       = [ tag: 'drop',   variable: number ];

export type Terminator = Branch | Return;
export type Branch     = [ tag: 'branch', blocks: number[] ];
export type Return     = [ tag: 'return' ];

export type Label      = `@${string}`;

export type Tag = 'define' | 'use' | 'drop' | 'branch' | 'return';

export function get_tag(instruction: Line | Terminator): Tag {
    return instruction[0];
}

export function get_arg(instruction: Line) {
    return instruction[1];
}

export function get_target(instruction: Branch) {
    return instruction[1];
}
