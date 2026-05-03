// Copyright (c) 2026 Marco Nikander

export type Program    = readonly Function[];
export type Function   = { name: Label, params: Register[], blocks: Block[] };
export type Block      = { name: Label, lines: Line[], terminator: Terminator };

export type Line       = Define | Use | Free ;
export type Define     = [ tag: 'define', variable: Register ];
export type Use        = [ tag: 'use',    variable: Register ];
export type Free       = [ tag: 'free',   variable: Register ];

export type Terminator = Branch | Return;
export type Branch     = [ tag: 'branch', blocks: Label[] ];
export type Return     = [ tag: 'return' ];

export type Register   = `%${string}`;
export type Label      = `@${string}`;

export type Tag = 'define' | 'use' | 'free' | 'branch' | 'return';

export function get_tag(instruction: Line | Terminator): Tag {
    return instruction[0];
}

export function get_arg(instruction: Line | Branch) {
    return instruction[1];
}
