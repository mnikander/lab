#lang datalog

edge(entry, a).

edge(a, c).
edge(c, d).
edge(d, e).

edge(a, b).

predecessor(X, Z) :- edge(X, Z).
predecessor(X, Z) :- edge(X, Y), predecessor(Y, Z).

descendents(Ancestor, L, R) :- predecessor(Ancestor, L), predecessor(Ancestor, R).
ancestors(L, R, Descendent) :- predecessor(L, Descendent), predecessor(R, Descendent).

split(L, R) :- edge(P, L), edge(P, R), L != R.

split(b, X)?
