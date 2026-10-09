// Copyright (c) 2026 Marco Nikander

import * as IR from "./grammar.ts";
import { VariableState } from "./lattice.ts";

export type Op = Use | Define | Drop;
export type Define = ["define", IR.ResourceId];
export type Use = ["use", IR.ResourceId];
export type Drop = ["drop", IR.ResourceId];

export function translate(
  line: IR.Line,
  points_to_set: IR.ResourceId[][],
  state: VariableState[],
): Op[] {
  switch (line[0]) {
    case "let":
      return translate_let(line, points_to_set);
    case "drop":
      return translate_drop(line);
    case "jump":
      return translate_jump(line);
    case "branch":
      return translate_branch(line);
    case "return":
      return translate_return(line, points_to_set, state);
    default:
      return line as never;
  }
}

function translate_let(line: IR.Let, points_to_set: IR.ResourceId[][]): Op[] {
  const lhs: Op[] = [["define", line[1]]];
  const rhs: Op[] = translate_operation(line[2], points_to_set);
  return [...lhs, ...rhs];
}

function translate_drop(line: IR.Drop): Op[] {
  return [["drop", line[1]]];
}

function translate_jump(_: IR.Jump): Op[] {
  return [];
}

function translate_branch(line: IR.Branch): Op[] {
  const cond: IR.Operand = line[1];
  const args: IR.Arguments = line[4];
  return [...translate_operand(cond), ...translate_arguments(args)];
}

function translate_return(
  line: IR.Return,
  points_to_set: IR.ResourceId[][],
  state: VariableState[],
): Op[] {
  // TODO: implement return logic here
  // - for all pointer-type variables which are not "Destroyed": apply_use
  return [["use", line[1]]];
}

function translate_operation(
  rhs: IR.Operation,
  points_to_set: IR.ResourceId[][],
): Op[] {
  switch (rhs[0]) {
    case "call":
      return translate_arguments(rhs[2]);
    case "borrow":
      return translate_operand(rhs[1]);
    case "load": {
      const pointer: IR.Operand = rhs[1];
      const pointer_ops: Op[] = translate_operand(pointer);
      const pointees: IR.ResourceId[] = points_to_set[IR.to_index(pointer[1])];
      const pointee_ops: Op[] = pointees.map((p) => ["use", p]);
      return [...pointer_ops, ...pointee_ops];
    }
    case "unary":
      return translate_operand(rhs[1]);
    case "binary":
      return [...translate_operand(rhs[1]), ...translate_operand(rhs[2])];
    default:
      return rhs as never;
  }
}

function translate_arguments(args: IR.Arguments): Op[] {
  const os: IR.Operand[] = [...args.slice(1)] as IR.Operand[];
  const ops: Op[][] = os.map((x) => translate_operand(x));
  return ops.flat(1);
}

function translate_operand(o: IR.Operand): Op[] {
  switch (o[0]) {
    case "peek":
      return [["use", o[1]]];
    case "move":
      return [["drop", o[1]]];
    case "constant":
      return [];
    default:
      return o as never;
  }
}
