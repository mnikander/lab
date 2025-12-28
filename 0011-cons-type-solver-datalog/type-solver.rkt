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

check_inputs (Args, Sig) :- cons(Sig, In, Out), in(Args, In).
check_inputs (Args, Sig) :- cons(Sig, In, Out), atom(Args, V), in(V, In).
% something is broken here:                                                           v v v v v v v v v v v v v v v v v v v v v
check_inputs (Args, Sig) :- cons(Sig, In, Out), cons(Args, V1, V2), cons(In, T1, T2), check_inputs(V1, T1), check_inputs(V2, T2).
check_outputs(Type, Sig) :- cons(Sig, In, Out), equal(Type, Out).

typeof(Id, Type) :- atom(Id, Value), type(Id, Type), in(Value, Type).
typeof(Id, Type) :- func(Id), type(Id, Type), cons(Type, T1, T2).
typeof(Id, Type) :- call(Id, Fn, Args), type(Id, Type), func(Fn), type(Fn, Sig), check_inputs(Args, Sig), check_outputs(Type, Sig).

% function flip : i1 -> i1
func(flip). type(flip, sig_flip). cons(sig_flip, i1, i1).

% function mix : i1 -> i1 -> i1
func(mix). type(mix, sig_mix). cons(sig_mix, sig_mix_input, i1). cons(sig_mix_input, i1, i1).

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
call(e, flip, a).          % ok

type(f, i1).
call(f, flip, b).          % ok

type(g, i4).
call(g, flip, a).          % error

cons(zero-one, 0, 1).
cons(a-b, a, b).

type(h, i1).
call(h, mix, zero-one).    % ok -- something is broken here

type(i, i1).
call(i, mix, a-b).         % ok -- something is broken here

% Query
typeof(X, Type)?
