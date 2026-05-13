// Copyright (c) 2026 Marco Nikander

import * as Capability from "./capability.ts";
import { file_printing_module } from "./file_printing_module.ts";
import { pretty_printer_module } from "./pretty_printer_module.ts";

function main(): void {
  const disk_module = file_printing_module(
    Capability.make_mock_disk_io<number>(),
    Capability.make_console_logger(),
  );
  const printer_module = pretty_printer_module(
    Capability.make_console_logger(),
  );

  printer_module.pretty_print([1, 2, 3]);
  disk_module.print_file("pi.bin");
}

main();
