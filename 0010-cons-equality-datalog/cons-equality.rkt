; Copyright (c) 2025 Marco Nikander

#lang datalog

% Relations:
%
%    atom(id, value)
%    let (id, target_id)
%    cons(id, left, right)
%    

% the empty value, i.e. unit type, exists:
nil.

% equality relation
equal(nil, nil).
equal(L, R) :- atom(L, VL), atom(R, VR), VL = VR.
equal(L, R) :- let(L, VL), let(R, VR), equal(VL, VR).
equal(L, R) :- let(L, VL), equal(VL, R).
equal(L, R) :- let(R, VR), equal(L, VR).
equal(L, R) :- cons(L, L1, L2), cons(R, R1, R2), equal(L1, R1), equal(L2, R2).

% define several atoms
% We don't have pointers, so we have to give them some kind of id or name so
% that we have a handle on them.

atom(a, "hello").     % a := "hello"
atom(b, "world").     % b := "world"
atom(c, "dear").      % c := "dear"
atom(d, "reader").    % d := "reader"
atom(e, "reader").    % d := "reader"

let (x, a).           % let x := a
let (y, b).           % let y := b
cons(ab, a, b).       % ab := (a . b)
cons(cd, c, d).       % ab := (c . d)
cons(xy, x, y).       % xy := (x . y)

% let abcd := [a b c d]
let(abcd, m1).
cons(m1, a, m2).
cons(m2, b, m3).
cons(m3, c, m4).
cons(m4, d, nil).

% o3 := [c d]
cons(o3, c, o4).
cons(o4, e, nil).

cons(ab-cd, ab, cd).

% Query:               % Expectation:
equal(a, a)?           % true
equal(a, x)?           % true
equal(a, b)?           % false
equal(ab, xy)?         % true
equal(m3, o3)?         % true
equal(ab-cd, abcd)?    % false
