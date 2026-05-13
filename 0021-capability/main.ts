// Copyright (c) 2026 Marco Nikander

import * as Capability from "./capability.ts";

export function import_pretty_printer_module(logger: Capability.Log) {
  return {
    pretty_print: (array: number[]) => {
      array.forEach((e) => logger.log(e.toString()));
    },
  };
}

function main(): void {
  const logger: Capability.Log = Capability.make_console_logger();
  const kv_store: Capability.KeyValueStore<number, string> = Capability
    .make_local_kv_store();
  const printer_module = import_pretty_printer_module(logger);
  printer_module.pretty_print([1, 2, 3]);

  // the following does not type check, since the wrong capability was provided to the 'module':
  // const printer2 = import_pretty_printer_module(kv_store);
}

main();
