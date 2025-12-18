#lang datalog

edge(a, b).
edge(b, c).
edge(c, d).
reachable(X, Z) :- edge(X,Z).
reachable(X, Z) :- edge(X, Y), reachable(Y, Z).

reachable(a, S)?
reachable(b, S)?
reachable(c, S)?
reachable(d, S)?

