import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect";
import { linewise_availability } from "./main.ts";
import { Result } from "./result.ts";
import { Block } from "./grammar.ts";
import { VariableState } from "./lattice.ts";

const empty_block: Block = ["block", ["bindings"], ["instructions"]];

describe("empty block", () => {
  it("must accept empty input", () => {
    const result: Result<VariableState[]> = linewise_availability(
      empty_block,
      [],
      [],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(0);
  });

  it("must return availabilities unchanged", () => {
    const result: Result<VariableState[]> = linewise_availability(
      empty_block,
      [[], [], [], []],
      ["Undefined", "Available", "Destroyed", "Ambiguous"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(4);
    expect(result[1][0]).toEqual("Undefined");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Destroyed");
    expect(result[1][3]).toEqual("Ambiguous");
  });
});

describe("invalid input", () => {
  it("must throw on missing input availability", () => {
    expect(() =>
      linewise_availability(
        empty_block,
        [["%0"]],
        [],
      )
    ).toThrow();
  });

  it("must throw on missing points-to set", () => {
    expect(() =>
      linewise_availability(
        empty_block,
        [],
        ["Available"],
      )
    )
      .toThrow();
  });

  it("must throw on unequal lengths", () => {
    expect(() =>
      linewise_availability(
        empty_block,
        [[], []],
        ["Available"],
      )
    )
      .toThrow();
  });
});

describe("unary and binary instructions on integers", () => {
  it("must accept define and use of a constant", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(1);
    expect(result[1][0]).toEqual("Available");
  });

  it("must accept unary instruction", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["peek", "%0"]]],
      ["return", "%1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
  });

  it("must accept unary instruction with move", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["move", "%0"]]],
      ["return", "%1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Destroyed");
    expect(result[1][1]).toEqual("Available");
  });

  it("must accept binary instruction", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      ["let", "%1", ["unary", ["constant", 1]]],
      ["let", "%2", ["binary", ["peek", "%0"], ["peek", "%1"]]],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], [], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Available");
  });

  it("must accept binary instruction with the same variable twice", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      ["let", "%1", ["binary", ["peek", "%0"], ["peek", "%0"]]],
      ["return", "%1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
  });

  it("must accept binary instruction with a peek and move of the same variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      // evaluation is left-to-right, so "let %1 = add (peek %0) (move %0)" is valid
      ["let", "%1", ["binary", ["peek", "%0"], ["move", "%0"]]],
      ["return", "%1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Destroyed");
    expect(result[1][1]).toEqual("Available");
  });

  it("must reject binary instruction with a move and peek of the same variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      // evaluation is left-to-right, so "let %1 = add (move %0) (peek %0)" is a move-before-use error
      ["let", "%1", ["binary", ["move", "%0"], ["peek", "%0"]]],
      ["return", "%1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });
});

describe("return", () => {
  it("must reject return of 'Undefined' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept return of 'Available' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Available"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(1);
    expect(result[1][0]).toEqual("Available");
  });

  it("must reject return of 'Destroyed' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Destroyed"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept valid return of predefined variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Available"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(1);
    expect(result[1][0]).toEqual("Available");
  });

  it("must reject return of ambiguous variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[]],
      ["Ambiguous"],
    );
    expect(result[0]).toEqual("error");
  });
});

describe("drop", () => {
  it("must reject drop of 'Undefined' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Available", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept drop of 'Available' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Available", "Available"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Destroyed");
  });

  it("must reject drop of 'Destroyed' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Available", "Destroyed"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject drop of 'Ambiguous' variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Available", "Ambiguous"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept valid define-use-drop", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["constant", 5]]],
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Destroyed");
  });

  it("must reject double-drop", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["unary", ["constant", 5]]],
      ["drop", "%1"],
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], []],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });
});

describe("borrow", () => {
  it("must reject a borrow to Undefined resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept borrow to Available resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Available", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
  });

  it("must reject borrow to Destroyed resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Destroyed", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject borrow to Ambiguous resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Ambiguous", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept borrow to resource defined in block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
  });

  it("must reject borrow to a not-yet defined resource in the block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%0", ["unary", ["constant", 42]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject dangling borrow on return", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%0"],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Available", "Undefined", "Available"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept copy of a borrow", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["unary", ["peek", "%1"]]], // 'unary' instruction as a placeholder for 'copy'
      ["drop", "%1"],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], ["%0"]], // points-to sets are defined accordingly
      ["Available", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Destroyed");
    expect(result[1][2]).toEqual("Available");
  });

  it("must reject drop of a borrowed resource, where the borrow was copied", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["unary", ["peek", "%1"]]],
      ["drop", "%0"],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], ["%1"]],
      ["Available", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  // escape analysis must detect errors due to returning a pointer to a local
  // this analysis must permit returning a pointer if it is available
  it("must accept return of an available borrow", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["return", "%1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Available", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(2);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
  });

  it("must reject return of a dangling borrow", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%0"],
      ["return", "%1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"]],
      ["Destroyed", "Available"],
    );
    expect(result[0]).toEqual("error");
  });
});

describe("load", () => {
  it("must reject load of borrow to Undefined resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept load of borrow to Available resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Available", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Available");
  });

  it("must reject load of borrow to Destroyed resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Destroyed", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject load of borrow to Ambiguous resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Ambiguous", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept load of borrow to resource defined in the block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Available");
  });

  it("must reject load of borrow to a resource not-yet defined in the block", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["let", "%0", ["unary", ["constant", 42]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject load of dangling borrow", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%0"],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must reject load of a dropped borrow", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%1"],
      ["let", "%2", ["load", ["peek", "%1"]]],
      ["return", "%0"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Available", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept load of a borrowed borrowed resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["borrow", ["peek", "%1"]]],
      ["let", "%3", ["load", ["peek", "%2"]]],
      ["let", "%4", ["load", ["peek", "%3"]]],
      ["return", "%4"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], ["%1"], ["%0"], []],
      ["Undefined", "Undefined", "Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(5);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Available");
    expect(result[1][3]).toEqual("Available");
    expect(result[1][4]).toEqual("Available");
  });

  it("must reject load of a borrowed borrowed invalid resource", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", ["borrow", ["peek", "%1"]]],
      ["let", "%3", ["load", ["peek", "%2"]]],
      ["let", "%4", ["load", ["peek", "%3"]]],
      ["drop", "%0"],
      ["return", "%4"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], ["%1"], ["%0"], []],
      ["Undefined", "Undefined", "Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });
});

describe("jump", () => {
  it("must accept jump with any variable state", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["jump", "^1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], [], [], []],
      ["Undefined", "Available", "Destroyed", "Ambiguous"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(4);
    expect(result[1][0]).toEqual("Undefined");
    expect(result[1][1]).toEqual("Available");
    expect(result[1][2]).toEqual("Destroyed");
    expect(result[1][3]).toEqual("Ambiguous");
  });

  it("must accept jump with borrow in any state", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["jump", "^1"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], ["%0"], ["%0"], ["%0"]],
      ["Available", "Undefined", "Available", "Destroyed", "Ambiguous"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(5);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Undefined");
    expect(result[1][2]).toEqual("Available");
    expect(result[1][3]).toEqual("Destroyed");
    expect(result[1][4]).toEqual("Ambiguous");
  });
});

describe("call", () => {
  it("must accept call with Available arguments", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      ["let", "%1", ["unary", ["constant", 1]]],
      ["let", "%2", [
        "call",
        "@1",
        ["arguments", ["peek", "%0"], ["move", "%1"]],
      ]],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], [], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Destroyed");
    expect(result[1][2]).toEqual("Available");
  });

  it("must reject call with Unavailable arguments", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 0]]],
      ["drop", "%0"],
      ["let", "%1", ["unary", ["constant", 1]]],
      ["let", "%2", [
        "call",
        "@1",
        ["arguments", ["peek", "%0"], ["move", "%1"]],
      ]],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], [], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it("must accept call with Available borrow arguments", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["let", "%2", [
        "call",
        "@1",
        ["arguments", ["peek", "%1"], ["move", "%1"]],
      ]],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("ok");
    expect(result[1].length).toEqual(3);
    expect(result[1][0]).toEqual("Available");
    expect(result[1][1]).toEqual("Destroyed");
    expect(result[1][2]).toEqual("Available");
  });

  it("must reject call with Unavailable borrow arguments", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%1"],
      ["let", "%2", [
        "call",
        "@1",
        ["arguments", ["peek", "%1"], ["move", "%1"]],
      ]],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must reject call with peeked borrow to Unavailable variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%0"], // now the borrow '%1' is dangling, i.e. it points at nothing
      ["let", "%2", [
        "call",
        "@1",
        ["arguments", ["peek", "%1"]],
      ]],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });

  it.skip("must reject call with moved borrow to Unavailable variable", () => {
    const code: Block = ["block", ["bindings"], [
      "instructions",
      ["let", "%0", ["unary", ["constant", 42]]],
      ["let", "%1", ["borrow", ["peek", "%0"]]],
      ["drop", "%0"], // now the borrow '%1' is dangling, i.e. it points at nothing
      ["let", "%2", [
        "call",
        "@1",
        ["arguments", ["move", "%1"]],
      ]],
      ["return", "%2"],
    ]];
    const result: Result<VariableState[]> = linewise_availability(
      code,
      [[], ["%0"], []],
      ["Undefined", "Undefined", "Undefined"],
    );
    expect(result[0]).toEqual("error");
  });
});
