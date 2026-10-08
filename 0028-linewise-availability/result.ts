// Copyright (c) 2026 Marco Nikander

export type Result<T> =
  | ["ok", T]
  | ["error", message: string, line: number];
