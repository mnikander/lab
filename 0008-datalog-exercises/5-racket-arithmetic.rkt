#lang datalog

node(1).
node(2).
node(3).
edge(1, 2).

foo(X) :- edge(A, B), X :- *(A, B).

foo(X)?
