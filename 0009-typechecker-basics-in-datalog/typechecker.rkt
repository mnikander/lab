#lang datalog

% definition of type i1, i.e. booleans
in(i1, 0).
in(i1, 1).

% definition of type i4
in(i4, 0).
in(i4, 1).
in(i4, 2).
in(i4, 3).
in(i4, 4).
in(i4, 5).
in(i4, 6).
in(i4, 7).

% relations
assert_constant(L, T)    :- constant(L, V), in(T, V).
assert_variable(L, N, T) :- variable(L, N), type(N, T).
assert_call(L, T)        :- call(L, F), signature(F, T_other, T), assert_arg(L, V, T_other).
assert_arg(L, V, T)      :- arg(L, V), in(T, V).
assert_arg(L, N, T)      :- arg(L, N), type(N, T).
type(N, T)               :- let(L, N, T), assert_constant(L, T).
type(N, T)               :- let(L, N, T), assert_variable(L, N_other, T).
type(N, T)               :- let(L, N, T), assert_call(L, T).

% function signatures
signature(not, i1, i1).

% code
let( 0, a, i1). constant( 0, 0).              % ok
let( 1, b, i1). constant( 1, 1).              % ok
let( 2, c, i1). constant( 2, 2).              % error: trying to assign an i4 into an i1
let( 3, d, i4). constant( 3, 5).              % ok
let( 4, e, i4). variable( 4, d).              % ok
let( 5, f, i1). variable( 5, d).              % error: trying to assign an i4 into an i1
let( 6, g, i1). variable( 6, c).              % error: trying to assign from a variable which has an error
let( 7, h, i1). call( 7, not). arg( 7, 0).    % ok
let( 8, i, i1). call( 8, not). arg( 8, a).    % ok
let( 9, j, i1). call( 9, not). arg( 9, 5).    % error: 'not' expects an i1
let(10, k, i1). call(10, not). arg(10, d).    % error: 'not' expects an i1
let(11, l, i1). call(11, not). arg(11, c).    % error: trying to assign from a variable which has an error
let(12, m, i4). call(12, not). arg(12, 0).    % error: trying to assign an i1 into an i4

% queries
type(N, T)?
