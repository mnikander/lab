// Copyright (c) 2026 Marco Nikander

export type Definition = string;
export type Label      = string;

export type Block = {
    name: Label,
    predecessors: Label[],
    successors: Label[],
    body: Set<Definition>,
};

export type Availability = {
    name: Label,
    in: Set<Definition>,
    out: Set<Definition>,
};

export function traverse(block: Block, availability: Availability): Availability {
    if(block.name !== availability.name) {
        throw Error(`the given block '${block.name}' and availability for '${availability.name}' do not belong together`);
    }
    
    availability.out = availability.in.union(block.body);
    return availability;
} 
