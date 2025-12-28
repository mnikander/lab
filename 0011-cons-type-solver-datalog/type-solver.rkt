; Copyright (c) 2025 Marco Nikander

#lang datalog

% Definition of the unit type, i.e. the empty value:
in(nil, unit).

% Definition of type i1, i.e. booleans, which is {0, 1}
in(0, i1). in(1, i1).

% Definition of type i4, which is {0, 1, 2, 3, 4, 5, 6, 7}
in(0, i4). in(1, i4). in(2, i4). in(3, i4). in(4, i4). in(5, i4). in(6, i4). in(7, i4).

% Equality relation
equal(nil, nil).
equal(L, R) :- atom(L, VL), atom(R, VR), VL = VR.
equal(L, R) :- cons(L, L1, L2), cons(R, R1, R2), equal(L1, R1), equal(L2, R2).

% Inequality relation
not_equal(L, nil) :- atom(L, VL).
not_equal(L, nil) :- cons(L, VL).
not_equal(nil, R) :- atom(R, VR).
not_equal(nil, R) :- cons(R, VR).
not_equal(L, R)   :- atom(L, VL), atom(R, VR), VL != VR, L != R.
not_equal(L, R)   :- cons(L, L1, L2), cons(R, R1, R2), not_equal(L1, R1), L != R.
not_equal(L, R)   :- cons(L, L1, L2), cons(R, R1, R2), not_equal(L2, R2), L != R.

% Placeholder for a function implementation:
func.

% Relations:
%
%    atom(id, value)
%    cons(id, left, right)
%    type(id, typename)
%
% Note that all ids are assumed to be unique. This must be ensured beforehand.


typeof(Id, Type) :- atom(Id, Value), type(Id, Type), in(Value, Type).
typeof(Id, func) :- atom(Id, func), type(Id, Sig), cons(Sig, T1, T2).

% Define several atoms
atom(a,   0). type(a, i1).    % ok
atom(b, nil). type(b, i1).    % error
atom(c, 666). type(c, i1).    % error

% function flip : i1 -> i1
atom(flip, func). type(flip, sig_flip). cons(sig_flip, i1, i1).

% Query
typeof(X, Type)?
