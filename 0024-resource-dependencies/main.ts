// Copyright (c) 2026 Marco Nikander

import * as G from "./grammar.ts";
import { Graph } from "./graph.ts";

export type DependencyGraph = Dependency[][];
export type Dependency = ["type", number] | ["target_of", Dependency];

// TODO: implement this
export function compute_dependencies(
  func: G.Function,
  _cfg: Graph,
): DependencyGraph {
  // TODO: should I use the worklist algorithm as is, or modify it to operate on code lines directly?
  // TODO: what is the lattice? is it the dependencies from each resource to other resources?
  // TODO: where do I handle phi-nodes? at the instruction level, or in the `join` of the worklist algorithm?
  // TODO: use worklist algorithm to iterate over the CFG and compute the dependencies

  return make_empty_dependencies(func);
}

function make_empty_dependencies(func: G.Function): DependencyGraph {
  const params: G.Parameter[] = G.get_params(func);
  const allocas: G.Alloca[] = G.get_allocas(func);
  const empty_deps_for_params: DependencyGraph = params.map((_e) => []);
  const empty_deps_for_allocas: DependencyGraph = allocas.map((_e) => []);
  return [...empty_deps_for_params, ...empty_deps_for_allocas];
}

// TODO: implement function which updates dependencies for a basic block

// this processes a single line
function update_dependencies(
  deps: DependencyGraph,
  line: G.Line,
  func: G.Function,
  prog: G.Program,
): DependencyGraph {
  if (line[0] === "assign") {
    switch (line[2]) {
      case "phi":
        deps = update_phi(deps, line);
        break;
      case "constant":
        deps = update_constant(deps, line);
        break;
      case "add":
        deps = update_add(deps, line);
        break;
      case "copy":
        deps = update_copy(deps, line);
        break;
      case "move":
        deps = update_move(deps, line);
        break;
      case "own":
        deps = update_own(deps, line);
        break;
      case "borrow":
        deps = update_borrow(deps, line);
        break;
      case "load":
        deps = update_load(deps, line, func);
        break;
      case "call":
        deps = update_call(deps, line, prog);
        break;
      default:
        throw Error("Bug: unhandled case");
    }
  }
  return deps;
}

// `x = phi a b ...` means `deps x = union (deps a) (deps b) ...`
function update_phi(deps: DependencyGraph, line: G.Phi): DependencyGraph {
  const id: number = line[1];
  const node: Dependency[] = deps[id];
  const other_ids: number[] = line[3];
  const other_nodes: Dependency[][] = other_ids.map((id) => deps[id]);
  const combined_nodes: Dependency[] = [...node, ...(other_nodes.flat(1))];
  // TODO: eliminate duplicate dependencies, the above has to be a union not a concatenation
  deps[id] = combined_nodes;
  return deps;
}

// `x = constant` means `deps x = empty`
function update_constant(
  deps: DependencyGraph,
  line: G.Constant,
): DependencyGraph {
  const id: number = line[1];
  deps[id] = [];
  return deps;
}

// `x = add a b` means `deps x = empty`
function update_add(deps: DependencyGraph, line: G.Add): DependencyGraph {
  const id: number = line[1];
  deps[id] = [];
  return deps;
}

// `x = copy a` means `deps x = deps a`
function update_copy(deps: DependencyGraph, line: G.Copy): DependencyGraph {
  const id: number = line[1];
  const other_id: number = line[3];
  deps[id] = deps[other_id];
  return deps;
}

// `x = move a` means `deps x = deps a`
function update_move(deps: DependencyGraph, line: G.Move): DependencyGraph {
  const id: number = line[1];
  const other_id: number = line[3];
  deps[id] = deps[other_id];
  return deps;
}

// `x = own a` means `deps x = union a (deps a)`
function update_own(deps: DependencyGraph, line: G.Own): DependencyGraph {
  const current_id: number = line[1];
  const other_id: number = line[3];
  const current_dep: Dependency[] = deps[current_id];
  const other_deps: Dependency[] = deps[other_id];
  deps[current_id] = [...current_dep, ...other_deps];
  // TODO: eliminate duplicate dependencies, the above has to be a union not a concatenation
  return deps;
}

// `x = borrow a` means `deps x = union a (deps a)`
function update_borrow(deps: DependencyGraph, line: G.Borrow): DependencyGraph {
  const current_id: number = line[1];
  const other_id: number = line[3];
  const current_dep: Dependency[] = deps[current_id];
  const other_deps: Dependency[] = deps[other_id];
  deps[current_id] = [...current_dep, ...other_deps];
  // TODO: eliminate duplicate dependencies, the above has to be a union not a concatenation
  return deps;
}

// `x = load a` means `deps x = empty` **OR** `deps x = deps a`
// if 'a' is pointer-to-int then `deps x = empty`
// else `deps x = deps a`
function update_load(
  deps: DependencyGraph,
  line: G.Load,
  func: G.Function,
): DependencyGraph {
  const id: number = line[1];
  const other_id: number = line[3];
  const param_count: number = func[2].length;
  const is_param: boolean = other_id < param_count;
  const other_attributes: G.Type = is_param
    ? func[2][other_id][1]
    : func[3][other_id - param_count][1];
  const other_type: G.UnqualifiedType = other_attributes[4];
  if (
    (G.is_owned(other_type) || G.is_borrowed(other_type)) &&
    G.is_int(other_type[1][4])
  ) {
    deps[id] = [];
  } else {
    deps[id] = deps[other_id];
  }
  return deps;
}

// TODO: test this, because it has so much indirection with indices that there is probably a bug
// `x = call a b ...` means `deps x = union (deps caller_scope_params)`
function update_call(
  deps: DependencyGraph,
  line: G.Call,
  prog: G.Program,
): DependencyGraph {
  const id: number = line[1];
  const argument_ids: number[] = line[4];
  const called_function: G.Function = prog[line[3]];
  const called_function_params: G.Parameter[] = G.get_params(called_function);
  let result_dependencies: Dependency[] = [];
  called_function_params.forEach(
    (p, i) => {
      if (is_caller_scope(p)) {
        result_dependencies = [
          ...result_dependencies,
          ...deps[argument_ids[i]],
        ];
      }
    },
  );
  deps[id] = result_dependencies;
  return deps;
}

function is_caller_scope(param: G.Parameter): boolean {
  return param[1][1] === "caller";
}
