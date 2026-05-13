// Copyright (c) 2026 Marco Nikander

export interface ConsoleOutput {
  log: (s: string) => void;
}

// this is a crude approximation of disk IO, where we treat data as an array of numbers
export interface DiskInput<T> {
  load: (filename: string) => undefined | T[];
}

export interface DiskOutput<T> {
  store: (filename: string, data: T[]) => void;
}

export function console_logger(): ConsoleOutput {
  return {
    log: (s: string) => {
      return console.log(s);
    },
  };
}

export function mock_disk_io<T>(): DiskInput<T> & DiskOutput<T> {
  const internal_storage = new Map<string, T[]>();
  return {
    store: (filename: string, data: T[]) => {
      internal_storage.set(filename, data);
    },
    load: (filename: string) => {
      const value = internal_storage.get(filename);
      return value;
    },
  };
}
