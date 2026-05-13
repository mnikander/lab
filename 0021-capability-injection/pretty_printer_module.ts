// Copyright (c) 2026 Marco Nikander

import * as Capability from "./capability.ts";

export function import_pretty_printer_module(
  console_out: Capability.ConsoleOutput,
) {
  return {
    // functions exported by this module:
    pretty_print: (array: number[]) => {
      array.forEach((e) => console_out.log(e.toString()));
    },
  };
}
