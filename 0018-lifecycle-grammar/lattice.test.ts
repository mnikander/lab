import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { define, free, get_state, is_ok, Result, use } from "./lattice.ts";

describe("life-cycle", () => {
  it("(define) => ok", () => {
    const result: Result = define(["ok", "pre"]);
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("live");
  });

  it("(use) => error", () => {
    const result: Result = use(["ok", "pre"]);
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free) => error", () => {
    const result: Result = free(["ok", "pre"]);
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, define) => error", () => {
    const result: Result = define(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, use) => ok", () => {
    const result: Result = use(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("live");
  });

  it("(define, free) => ok", () => {
    const result: Result = free(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("post");
  });

  it("(use, define) => error", () => {
    const result: Result = define(use(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, use) => error", () => {
    const result: Result = use(use(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, free) => error", () => {
    const result: Result = free(use(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, define) => error", () => {
    const result: Result = define(free(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, use) => error", () => {
    const result: Result = use(free(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, free) => error", () => {
    const result: Result = free(free(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, define, define) => error", () => {
    const result: Result = define(define(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, define, use) => error", () => {
    const result: Result = use(define(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, define, free) => error", () => {
    const result: Result = free(define(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, use, define) => error", () => {
    const result: Result = define(use(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, use, use) => ok", () => {
    const result: Result = use(use(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("live");
  });

  it("(define, use, free) => ok", () => {
    const result: Result = free(use(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("post");
  });

  it("(define, free, define) => error", () => {
    const result: Result = define(free(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, free, use) => error", () => {
    const result: Result = use(free(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(define, free, free) => error", () => {
    const result: Result = free(free(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, define, define) => error", () => {
    const result: Result = define(define(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, define, use) => error", () => {
    const result: Result = use(define(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, define, free) => error", () => {
    const result: Result = free(define(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, use, define) => error", () => {
    const result: Result = define(use(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, use, use) => error", () => {
    const result: Result = use(use(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, use, free) => error", () => {
    const result: Result = free(use(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, free, define) => error", () => {
    const result: Result = define(free(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, free, use) => error", () => {
    const result: Result = use(free(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(use, free, free) => error", () => {
    const result: Result = free(free(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, define, define) => error", () => {
    const result: Result = define(define(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, define, use) => error", () => {
    const result: Result = use(define(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, define, free) => error", () => {
    const result: Result = free(define(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, use, define) => error", () => {
    const result: Result = define(use(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, use, use) => error", () => {
    const result: Result = use(use(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, use, free) => error", () => {
    const result: Result = free(use(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, free, define) => error", () => {
    const result: Result = define(free(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, free, use) => error", () => {
    const result: Result = use(free(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("(free, free, free) => error", () => {
    const result: Result = free(free(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });
});
