// Copyright (c) 2026 Marco Nikander

import * as Capability from "./capability.ts";

export function file_printing_module(
  disk_in: Capability.DiskInput<number>,
  console_out: Capability.ConsoleOutput,
) {
  return {
    // functions exported by this module:
    print_file: (filename: string) => {
      const data: undefined | number[] = disk_in.load(filename);
      if (data !== undefined) {
        data.forEach((e) => console_out.log(e));
      } else {
        console_out.log(`Error: could not open filepath '${filename}'`);
      }
    },
  };
}
