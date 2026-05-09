// Copyright (c) 2026 Marco Nikander

export type Worklist = { queue: number[]; contains: boolean[] };

export function contains(index: number, worklist: Worklist): boolean {
  return worklist.contains[index];
}

// in-place update
export function try_push(index: number, worklist: Worklist) {
  if (worklist.contains[index] === false) {
    worklist.contains[index] = true;
    worklist.queue.push(index);
  }
}

// in-place update
export function try_pop(worklist: Worklist): undefined | number {
  const value: undefined | number = worklist.queue.shift();
  if (value !== undefined) {
    worklist.contains[value] = false;
  }
  return value;
}

export function size(worklist: Worklist): number {
  return worklist.queue.length;
}

export function make_worklist(count: number): Worklist {
  return { queue: iota(count), contains: fill(count, true) };
}

export function iota(count: number): number[] {
  return [...Array(count).keys()];
}

export function fill<T>(count: number, value: T): T[] {
  return Array(count).fill(value);
}

export function copy<T>(array: T[]): T[] {
  return array.map((e) => e);
}
