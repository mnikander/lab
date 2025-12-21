#lang datalog

node(1).
node(2).
edge(1, 2).

foo(X) :- node(A), node(B), X :- *(A, B).

foo(X)?
