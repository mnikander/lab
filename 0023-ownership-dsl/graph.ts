// Copyright (c) 2026 Marco Nikander

export type Graph = Node[];

export type Node = {
  pred: number[];
  succ: number[];
};
