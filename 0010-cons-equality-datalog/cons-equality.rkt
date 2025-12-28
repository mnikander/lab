; Copyright (c) 2025 Marco Nikander

#lang datalog

% Relations:
%
%    atom(id, value)
%    let (id, target_id)
%    cons(id, left, right)
%
% Note that all ids are assumed to be unique. This must be ensured beforehand.

% the empty value, i.e. unit type, exists:
nil.

% Equality relation
equal(nil, nil).
equal(L, R) :- atom(L, VL), atom(R, VR), VL = VR.
equal(L, R) :- let(L, VL), let(R, VR), equal(VL, VR).
equal(L, R) :- let(L, VL), equal(VL, R).
equal(L, R) :- let(R, VR), equal(L, VR).
equal(L, R) :- cons(L, L1, L2), cons(R, R1, R2), equal(L1, R1), equal(L2, R2).

% Inequality relation
not_equal(L, nil) :- atom(L, VL).
not_equal(L, nil) :- let(L, VL).
not_equal(L, nil) :- cons(L, VL).
not_equal(nil, R) :- atom(R, VR).
not_equal(nil, R) :- let(R, VR).
not_equal(nil, R) :- cons(R, VR).
not_equal(L, R)   :- atom(L, VL), atom(R, VR), VL != VR, L != R.
not_equal(L, R)   :- let(L, VL), let(R, VR), not_equal(VL, VR), L != R.
not_equal(L, R)   :- let(L, VL), not_equal(VL, R), L != R.
not_equal(L, R)   :- let(R, VR), not_equal(L, VR), L != R.
not_equal(L, R)   :- cons(L, L1, L2), cons(R, R1, R2), not_equal(L1, R1), L != R.
not_equal(L, R)   :- cons(L, L1, L2), cons(R, R1, R2), not_equal(L2, R2), L != R.

% Define several example atoms
% We don't have pointers, so we have to give them some kind of id or name so
% that we have a handle on them.

atom(a, "hello").          % a := "hello"
atom(b, "world").          % b := "world"
atom(c, "dear").           % c := "dear"
atom(d, "reader").         % d := "reader"
atom(e, "reader").         % d := "reader"

let (x, a).                % let x := a
let (y, b).                % let y := b
cons(ab, a, b).            % ab := (a . b)
cons(cd, c, d).            % ab := (c . d)
cons(xy, x, y).            % xy := (x . y)

let(abcd, m1).             % let abcd := [a b c d]
cons(m1, a, m2).
cons(m2, b, m3).
cons(m3, c, m4).
cons(m4, d, nil).

cons(o3, c, o4).           % o3 := [c e]
cons(o4, e, nil).

cons(ab-cd, ab, cd).       % ab-cd := (ab . cd)

% Query:                   % Expectation:
equal(a, a)?               % true
equal(a, x)?               % true
equal(a, b)?               % false
equal(ab, xy)?             % true
equal(m3, o3)?             % true
equal(ab-cd, abcd)?        % false

% Query:                   % Expectation:
not_equal(a, nil)?         % true
not_equal(a, b)?           % true
not_equal(d, e)?           % false
not_equal(ab, o3)?         % true
not_equal(ab-cd, abcd)?    % true
not_equal(m3, o3)?         % false
