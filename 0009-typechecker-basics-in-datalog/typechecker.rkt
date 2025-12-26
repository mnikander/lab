#lang datalog

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

% Helpers
assert_constant(L, T)    :- constant(L, V), in(V, T).
assert_variable(L, N, T) :- variable(L, N), type(N, T).
assert_call(L, T)        :- call(L, F), signature(F, T_other, T), assert_arg(L, V, T_other).
assert_arg(L, V, T)      :- arg(L, V), in(V, T).
assert_arg(L, N, T)      :- arg(L, N), type(N, T).

% Relations
type(N, T)               :- let(L, N, T), assert_constant(L, T).
type(N, T)               :- let(L, N, T), assert_variable(L, N_other, T).
type(N, T)               :- let(L, N, T), assert_call(L, T).

% Function signatures
signature(not, i1, i1).                      % not :: i1 -> i1

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

let( 0, a, i1). constant( 0, 0).              % ok
let( 1, b, i1). constant( 1, 1).              % ok
let( 2, c, i1). constant( 2, 2).              % error: assigned an i4 into an i1
let( 3, d, i4). constant( 3, 5).              % ok
let( 4, e, i4). variable( 4, d).              % ok
let( 5, f, i1). variable( 5, d).              % error: assigned an i4 into an i1
let( 6, g, i1). variable( 6, c).              % error: assigned from a variable which has an error
let( 7, h, i1). call( 7, not). arg( 7, 0).    % ok
let( 8, i, i1). call( 8, not). arg( 8, a).    % ok
let( 9, j, i1). call( 9, not). arg( 9, 5).    % error: 'not' expects an i1
let(10, k, i1). call(10, not). arg(10, d).    % error: 'not' expects an i1
let(11, l, i1). call(11, not). arg(11, c).    % error: assigned from a variable which has an error
let(12, m, i4). call(12, not). arg(12, 0).    % error: assigned an i1 into an i4

% Query to output all variables with a valid type
type(N, T)?
