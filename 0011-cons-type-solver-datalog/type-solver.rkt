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
equal(L, R) :- L = R.
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

% Relations:
%
%    atom(id, value)
%    func(id)
%    cons(id, left, right)
%    type(id, typename)
%    call(id, function, arguments)
%
% Note that all ids are assumed to be unique. This must be ensured beforehand.

typeof(Id, Type) :- atom(Id, Value),    type(Id, Type), in(Value, Type).
typeof(Id, Type) :- func(Id),           type(Id, Type), cons(Type, Sig_first, Sig_rest).
typeof(Id, Type) :- call(Id, Fn, Args), type(Id, Type), func(Fn), type(Fn, Sig_Fn), match(Sig_Fn, Args, Type).


match(S, Arg, Discard) :- atom(Arg, V), in(V, S), in(X, Discard).
match(Sig, nil , T)    :- cons(Sig, T_other, nil), in(Discard, T), T_other = T.
match(Sig, Args, T)    :- cons(Sig, S_first, S_rest), cons(Args, A_first, A_rest), match(S_first, A_first, T), match(S_rest, A_rest, T).


% function flip : i1 -> i1
func(flip). type(flip, sf0). cons(sf0, i1, sf1). cons(sf1, i1, nil).

% function mix : i1 -> i1 -> i1
func(mix ). type(mix , sm0). cons(sm0, i1, sm1). cons(sm1, i1, sm2). cons(sm2, i1, nil).

% Define atoms and cons-cells
atom(a, 0).
type(a, i1).               % ok

atom(b, 1).
type(b, i1).               % ok

atom(c, nil).
type(c, i1).               % error

atom(d, 666).
type(d, i1).               % error

type(e, i1).
cons(e0, a, nil).
call(e, flip, e0).         % ok

type(f, i1).
cons(f0, b, nil).
call(f, flip, f0).         % ok

type(g, i4).
cons(g0, b, nil).
call(g, flip, g0).         % error

type(j, i1).
cons(j0, a, j1).
cons(j1, b, nil).
call(j, mix, j0).          % ok

type(k, i4).
cons(k0, a, k1).
cons(k1, b, nil).
call(k, mix, k0).          % error

type(l, i1).
cons(l0, b, nil).
call(l, mix, l0).          % error


% Query
typeof(X, Sig)?
