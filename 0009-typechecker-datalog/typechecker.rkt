; Copyright (c) 2025 Marco Nikander

#lang datalog

% The empty value, i.e. unit type, exists:
nil.

% Definition of type i1, i.e. booleans, which is {0, 1}
in(0, i1).
in(1, i1).

% Definition of type i4, which is {0, 1, 2, 3, 4, 5, 6, 7}
in(0, i4).
in(1, i4).
in(2, i4).
in(3, i4).
in(4, i4).
in(5, i4).
in(6, i4).
in(7, i4).

% Basic relations for cons-cells:
%
%    atom(line, id, value)
%    cons(line, id, left, right)
%
% Equality relation between atoms and cons-cells:
equal(L, nil, nil) :- let(L, N, T).
equal(L, A, B)     :- atom(L, A, VA), atom(L, B, VB), VA = VB.
equal(L, A, B)     :- cons(L, A, A1, A2), cons(L, B, B1, B2), equal(L, A1, B1), equal(L, A2, B2).

% Note that in the following:
% - L is a Line number
% - N is a Name of a variable
% - V is a Value of a constant
% - T is a Type
% - F is a Function name

% Helpers
assert_constant(L, T)    :- constant(L, V), in(V, T).
assert_variable(L, N, T) :- variable(L, N), type(N, T).

assert_call(L, T)  :- 
    call      (L   , Func, Args),
    atom      (L   , Args, V   ),
    fn        (Ldef, Func, Sgnt),
    cons      (Ldef, Sgnt, In , Out),
    atom      (Ldef, In  , T_in),
    atom      (Ldef, Out , T   ),    
    in        (V   , T_in).

assert_call(L, T)  :- 
    call      (L   , Func, Args),
    atom      (L   , Args, N   ),
    fn        (Ldef, Func, Sgnt),
    cons      (Ldef, Sgnt, In , Out),
    atom      (Ldef, In  , T_in),
    atom      (Ldef, Out , T   ),
    type      (N,    T).

% for multi-argument functions, a `cons(Ldef, In, TA, TB),` is needed
% for function or tuple return types, a `cons(Ldef, Out, A, B)` is needed

% Relations
type(N, T)               :- let(L, N, T), assert_constant(L, T).
type(N, T)               :- let(L, N, T), assert_variable(L, N_other, T).
type(N, T)               :- let(L, N, T), assert_call(L, T).

% Code has the form:
%
%    let a: i1 = 0
%    let d: i4 = 5
%    let h: i1 = not 0
%
% Datalog does not care about the order of statements. Each statement ends with
% dot '.'. In the statements below, the leading index is always the source line
% number. Statements for the let-binding on the left-hand side of the equals
% sign, and the constant, variable access, function call, and parameters on the
% right-hand side, are all stitched together using their source line number.

let( 0, a, i1). constant( 0, 0).                         % ok
let( 1, b, i1). constant( 1, 1).                         % ok
let( 2, c, i1). constant( 2, 2).                         % error: assigned an i4 into an i1
let( 3, d, i4). constant( 3, 5).                         % ok
let( 4, e, i4). variable( 4, d).                         % ok
let( 5, f, i1). variable( 5, d).                         % error: assigned an i4 into an i1
let( 6, g, i1). variable( 6, c).                         % error: assigned from a variable which has an error
let( 7, h, i1). call( 7, not, arg). atom( 7, arg, 0).    % ok
let( 8, i, i1). call( 8, not, arg). atom( 8, arg, a).    % ok
let( 9, j, i1). call( 9, not, arg). atom( 9, arg, 5).    % error: 'not' expects an i1
let(10, k, i1). call(10, not, arg). atom(10, arg, d).    % error: 'not' expects an i1
let(11, l, i1). call(11, not, arg). atom(11, arg, c).    % error: assigned from a variable which has an error
let(12, m, i4). call(12, not, arg). atom(12, arg, 0).    % error: assigned an i1 into an i4

% not: i1 -> i1
fn(14, not, signature). cons(14, signature, in, out). atom(14, in, i1). atom(14, out, i1).

% Testing queries
let(15, n, i1). call(15, not, args). atom(15, args, 0).    % let n := call not 0
let(16, n, i1). call(16, not, args). atom(16, args, 2).    % let n := call not 2
assert_call(15, T)?
assert_call(16, T)?

% Query to output all variables with a valid type
type(N, T)?
