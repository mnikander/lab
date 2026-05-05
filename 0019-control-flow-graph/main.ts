// Copyright (c) 2026 Marco Nikander

import * as HIGH from "./grammar.ts";

export type Node = {
  name: HIGH.Label;
  predecessors: number[];
  successors: number[];
};

export type CFG = Node[];

export function make_cfg(func: HIGH.Function): CFG {
  const block_names: HIGH.Label[] = extract_block_names(func);
  const successors: number[][] = func.blocks.map((b) =>
    block_successors(b, block_names)
  );
  const predecessors: number[][] = func.blocks.map((_b) => []); // initialize empty array
  for (let start = 0; start < func.blocks.length; ++start) {
    const ends: number[] = successors[start];
    ends.forEach((e) => predecessors[e].push(start));
  }

  // zip
  const result: CFG = func.blocks.map((_b, i) => {
    return {
      name: block_names[i],
      predecessors: predecessors[i],
      successors: successors[i],
    };
  });
  return result;
}

function block_successors(
  block: HIGH.Block,
  block_names: HIGH.Label[],
): number[] {
  const successor_labels: HIGH.Label[] = extract_successor_labels(
    block.terminator,
  );
  const successor_indices: number[] = successor_labels.map((name) =>
    label_to_index(name, block_names)
  );
  return successor_indices;
}

function label_to_index(name: HIGH.Label, block_names: HIGH.Label[]): number {
  return block_names.findIndex((n) => name === n);
}

function extract_successor_labels(terminator: HIGH.Terminator): HIGH.Label[] {
  if (terminator[HIGH.Get.Tag] === "jump") {
    return [terminator[HIGH.Get.Left]];
  } else if (terminator[HIGH.Get.Tag] === "branch") {
    return terminator[HIGH.Get.Right];
  } else if (terminator[HIGH.Get.Tag] === "return") {
    return [];
  } else {
    throw Error("unhandled case");
  }
}

function extract_block_names(func: HIGH.Function): HIGH.Label[] {
  return func.blocks.map((b) => b.name);
}
