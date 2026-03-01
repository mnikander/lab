// Copyright (c) 2026 Marco Nikander

export type Definition = string;

export type Block = {
    index: number,
    predecessors: number[],
    successors: number[],
    body: Set<Definition>,
};

export type Availability = {
    index:    number,
    in_join:  Set<Definition>,
    in_meet:  Set<Definition>,
    out_join: Set<Definition>,
    out_meet: Set<Definition>,
};
