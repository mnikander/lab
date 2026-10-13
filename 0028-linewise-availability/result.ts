// Copyright (c) 2026 Marco Nikander

export type Result<T> =
  | Ok<T>
  | Fail;

export type Ok<T> = ["ok", T];
export type Fail = ["fail", message: string];

export function is_ok<T>(r: Result<T>): r is Ok<T> {
  return r[0] === "ok";
}

export function is_failure<T>(r: Result<T>): r is Fail {
  return r[0] === "fail";
}

export function ok<T>(t: T): Ok<T> {
  return ["ok", t];
}

export function fail(message: string): Fail {
  return ["fail", message];
}
