#lang datalog

%        a
%      /   \
%     b     c
%    /\     /\
%   d  e   f  g

parent(a, b).
parent(a, c).

parent(b, d).
parent(b, e).

parent(c, f).
parent(c, g).

person(X) :- parent(X, O).
person(X) :- parent(O, X).

sibling(X, Y) :- parent(P, X), parent(P, Y), P != X, P != Y, X != Y.

same_generation_impl(X, X) :- person(X).
same_generation_impl(X, Y) :- parent(P, X), same_generation_impl(P, Q), parent(Q, Y).

% interestingly, I need to wrap the whole thing to apply the X!=Y condition properly
same_generation(X, Y) :- same_generation_impl(X, Y), X != Y.

%person(X)?
%sibling(A, B)?
same_generation(X, Y)?
