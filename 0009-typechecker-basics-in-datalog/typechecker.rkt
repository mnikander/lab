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
correctly_typed(L) :- let(L, N, T), constant(L, V), in(T, V).

% code
let(0, a, i1). constant(0, 0).    % ok
let(1, b, i1). constant(1, 1).    % ok
let(2, c, i1). constant(2, 2).    % error

% queries
correctly_typed(L)?
