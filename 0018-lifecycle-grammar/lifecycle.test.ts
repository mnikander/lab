import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { define, free, get_state, is_ok, Result, use } from "./lattice.ts";

describe("life-cycle", () => {
  it("define", () => {
    const result: Result = define(["ok", "pre"]);
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("live");
  });

  it("use", () => {
    const result: Result = use(["ok", "pre"]);
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free", () => {
    const result: Result = free(["ok", "pre"]);
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, define", () => {
    const result: Result = define(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, use", () => {
    const result: Result = use(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("live");
  });

  it("define, free", () => {
    const result: Result = free(define(["ok", "pre"]));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("post");
  });

  it("use, define", () => {
    const result: Result = define(use(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, use", () => {
    const result: Result = use(use(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, free", () => {
    const result: Result = free(use(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, define", () => {
    const result: Result = define(free(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, use", () => {
    const result: Result = use(free(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, free", () => {
    const result: Result = free(free(["ok", "pre"]));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, define, define", () => {
    const result: Result = define(define(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, define, use", () => {
    const result: Result = use(define(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, define, free", () => {
    const result: Result = free(define(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, use, define", () => {
    const result: Result = define(use(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, use, use", () => {
    const result: Result = use(use(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("live");
  });

  it("define, use, free", () => {
    const result: Result = free(use(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(true);
    expect(get_state(result)).toEqual("post");
  });

  it("define, free, define", () => {
    const result: Result = define(free(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, free, use", () => {
    const result: Result = use(free(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("define, free, free", () => {
    const result: Result = free(free(define(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, define, define", () => {
    const result: Result = define(define(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, define, use", () => {
    const result: Result = use(define(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, define, free", () => {
    const result: Result = free(define(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, use, define", () => {
    const result: Result = define(use(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, use, use", () => {
    const result: Result = use(use(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, use, free", () => {
    const result: Result = free(use(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, free, define", () => {
    const result: Result = define(free(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, free, use", () => {
    const result: Result = use(free(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("use, free, free", () => {
    const result: Result = free(free(use(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, define, define", () => {
    const result: Result = define(define(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, define, use", () => {
    const result: Result = use(define(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, define, free", () => {
    const result: Result = free(define(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, use, define", () => {
    const result: Result = define(use(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, use, use", () => {
    const result: Result = use(use(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, use, free", () => {
    const result: Result = free(use(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, free, define", () => {
    const result: Result = define(free(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, free, use", () => {
    const result: Result = use(free(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });

  it("free, free, free", () => {
    const result: Result = free(free(free(["ok", "pre"])));
    expect(is_ok(result)).toBe(false);
    expect(get_state(result)).toEqual("top");
  });
});
