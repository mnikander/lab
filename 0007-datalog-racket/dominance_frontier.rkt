#lang datalog

edge(entry, a).

edge(a, c).
edge(c, d).
edge(d, e).

edge(a, b).

predecessor(X, Z) :- edge(X, Z).
predecessor(X, Z) :- edge(X, Y), predecessor(Y, Z).

inclusive_predecessor(X, Z) :- X = Z.
inclusive_predecessor(X, Z) :- edge(X, Z).
inclusive_predecessor(X, Z) :- edge(X, Y), predecessor(Y, Z).

descendents(Ancestor, L, R) :- predecessor(Ancestor, L), predecessor(Ancestor, R).
ancestors(L, R, Descendent) :- predecessor(L, Descendent), predecessor(R, Descendent).

split(X, Y)   :- edge(P, X), edge(P, Y), X != Y.

parallel(X, Y) :- 
    edge(O, L), 
    edge(O, R),
    predecessor(O, X), 
    predecessor(O, Y),
    inclusive_predecessor(L, X),
    inclusive_predecessor(R, Y),
    L != R,
    X != Y.

parallel(X, Y)?
