#lang datalog

edge(entry, a).

edge(a, c).
edge(c, d).
edge(d, e).

edge(a, b).

predecessor(X, Z) :- edge(X, Z).
predecessor(X, Z) :- edge(X, Y), predecessor(Y, Z).

predecessor(a, e)?
