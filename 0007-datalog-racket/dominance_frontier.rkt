#lang datalog

edge(entry, a).

edge(a, b).
edge(b, c).
edge(d, e).

edge(a, c).
edge(c, d).

predecessor(X, Z) :- edge(X, Z).
predecessor(X, Z) :- edge(X, Y), predecessor(Y, Z).

predecessor(a, e)?
