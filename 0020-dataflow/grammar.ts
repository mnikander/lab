// Copyright (c) 2026 Marco Nikander

export type Program    = readonly Function[];
export type Function   = { name: Label, params: readonly number[], blocks: readonly Block[] };
export type Block      = { name: Label, lines: readonly Line[], terminator: Terminator };

export type Line       = Define | Use | Free ;
export type Define     = readonly [ tag: 'define', variable: number ];
export type Use        = readonly [ tag: 'use',    variable: number ];
export type Free       = readonly [ tag: 'drop',   variable: number ];

export type Terminator = Branch | Return;
export type Branch     = readonly [ tag: 'branch', blocks: number[] ];
export type Return     = readonly [ tag: 'return' ];

export type Label      = `@${string}`;

export type Tag = 'define' | 'use' | 'drop' | 'branch' | 'return';

export function get_tag(instruction: Line | Terminator): Tag {
    return instruction[0];
}

export function get_arg(instruction: Line): number {
    return instruction[1];
}

export function get_target(instruction: Branch): number[] {
    return instruction[1];
}
