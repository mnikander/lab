// Copyright (c) 2026 Marco Nikander

import * as IR from "./grammar.ts";
import { VariableState } from "./lattice.ts";
import { Define, Drop, Op, Use } from "./dsl_grammar.ts";

export function translate(
  line: IR.Line,
  points_to_set: IR.ResourceId[][],
  state: VariableState[],
): Op[] {
  switch (line[0]) {
    case "let":
      return translate_let(line, points_to_set);
    case "drop":
      return translate_drop(line, points_to_set);
    case "jump":
      return translate_jump(line);
    case "branch":
      return translate_branch(line, points_to_set);
    case "return":
      return translate_return(line, points_to_set, state);
    default: {
      const _l: never = line;
      return [];
    }
  }
}

function translate_let(line: IR.Let, points_to_set: IR.ResourceId[][]): Op[] {
  const lhs: Define[] = [["define", line[1]]];
  const rhs: Op[] = translate_operation(line[2], points_to_set);
  return [...rhs, ...lhs]; // we evaluate the right hand side BEFORE we define the variable on the left hand side
}

function translate_drop(line: IR.Drop, points_to_set: IR.ResourceId[][]): Op[] {
  return [...use_pointees(line[1], points_to_set), ["drop", line[1]]];
}

function translate_jump(_: IR.Jump): Op[] {
  return [];
}

function translate_branch(
  line: IR.Branch,
  points_to_set: IR.ResourceId[][],
): Op[] {
  const cond: IR.Operand = line[1];
  const args: IR.Arguments = line[4];
  return [
    ...translate_operand(cond, points_to_set),
    ...translate_arguments(args, points_to_set),
  ];
}

function translate_return(
  line: IR.Return,
  points_to_set: IR.ResourceId[][],
  state: VariableState[],
): Op[] {
  type Triplet = [number, VariableState, IR.ResourceId[]];
  const zipped: Triplet[] = state.map((
    _,
    i,
  ) => [i, state[i], points_to_set[i]]);
  const non_destroyed: Triplet[] = zipped.filter((t) =>
    t[1] === "Available" || t[1] === "Ambiguous"
  );

  // for all pointer-type variables which are not "Destroyed":
  // use each variable in their points-to set
  // note that only pointer-type variables, have a non-empty points-to-set
  const use_available_borrows: Op[][] = non_destroyed.map((t) =>
    t[2].map((pointee) => ["use", pointee])
  );
  const borrow_ops: Op[] = use_available_borrows.flat(1);

  // for the return value's points-to-set: use
  const result_triplet: Triplet = zipped[IR.to_index(line[1])];
  const result_points_to_set_ops: Op[] = result_triplet[2].map(
    (pointee) => ["use", pointee],
  );

  // for the return value: use
  const result_ops: Op = ["use", line[1]];

  return [...borrow_ops, ...result_points_to_set_ops, result_ops];
}

function translate_operation(
  rhs: IR.Operation,
  points_to_set: IR.ResourceId[][],
): Op[] {
  switch (rhs[0]) {
    case "call":
      return translate_call(rhs, points_to_set);
    case "borrow":
      return translate_operand(rhs[1], points_to_set);
    case "load":
      return translate_load(rhs, points_to_set);
    case "unary":
      return translate_operand(rhs[1], points_to_set);
    case "binary":
      return [
        ...translate_operand(rhs[1], points_to_set),
        ...translate_operand(rhs[2], points_to_set),
      ];
    default: {
      const _n: never = rhs;
      return [];
    }
  }
}

function translate_call(
  rhs: IR.Call,
  points_to_set: IR.ResourceId[][],
): Op[] {
  return translate_arguments(rhs[2], points_to_set);
}

function translate_arguments(
  args: IR.Arguments,
  points_to_set: IR.ResourceId[][],
): Op[] {
  const os: IR.Operand[] = [...args.slice(1)] as IR.Operand[];
  const ops: Op[][] = os.map((x) => translate_operand(x, points_to_set));
  return ops.flat(1);
}

function translate_operand(
  o: IR.Operand,
  points_to_set: IR.ResourceId[][],
): Op[] {
  switch (o[0]) {
    case "peek":
      return [["use", o[1]]];
    case "move":
      return [...use_pointees(o[1], points_to_set), ["drop", o[1]]];
    case "constant":
      return [];
    default: {
      const _o: never = o[0];
      return [];
    }
  }
}

function translate_load(load: IR.Load, points_to_set: IR.ResourceId[][]): Op[] {
  const pointer: IR.Operand = load[1];
  const pointer_ops: Op[] = translate_operand(pointer, points_to_set);
  const pointees: IR.ResourceId[] = points_to_set[IR.to_index(pointer[1])];
  const pointee_ops: Op[] = pointees.map((p) => ["use", p]);
  return [...pointer_ops, ...pointee_ops];
}

// 'drop' of a variable MUST trigger a 'use' on the entire points-to set of that variable
function use_pointees(
  variable: IR.ResourceId,
  points_to_set: IR.ResourceId[][],
): Op[] {
  const index = IR.to_index(variable);
  const pointee_uses: Use[] = points_to_set[index].map((p) => ["use", p]);
  return pointee_uses;
}
