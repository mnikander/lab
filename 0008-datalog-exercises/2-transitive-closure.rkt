#lang datalog

edge(a, b).
edge(b, c).
edge(c, b).
edge(c, d).

reachable(X, Y):- edge(X, Y).
reachable(X, Z):- edge(X, Y), reachable(Y, Z).

% strongly-connected components (SCC)
scc(X, Y) :- reachable(X, Y), reachable(Y, X).

cycle(X)  :- reachable(X, X).
cyclic    :- reachable(X, X).

% acyclic   :- not cyclic.     % seems Racket-Datalog doesn't support the 'not' operation

cyclic?
