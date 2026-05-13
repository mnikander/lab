// Copyright (c) 2026 Marco Nikander

import * as Capability from "./capability.ts";
import { import_file_printing_module } from "./file_printing_module.ts";
import { import_pretty_printer_module } from "./pretty_printer_module.ts";

function main(): void {
  // function calls are used to 'import' a module which requires capabilities
  const printer_module = import_pretty_printer_module(
    Capability.make_console_logger(),
  );
  const disk_module = import_file_printing_module(
    Capability.make_mock_disk_io<number>(),
    Capability.make_console_logger(),
  );

  printer_module.pretty_print([1, 2, 3]);
  disk_module.print_file("pi.bin");
}

main();
