// Copyright (c) 2026 Marco Nikander

export type Graph = Node[];

export type Node = {
  pred: number[]; // TODO: I don't see why I would need predecessor in a propagation worklist, can I remove them?
  succ: number[];
};
