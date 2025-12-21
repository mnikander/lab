#lang datalog

node(1).
node(2).
node(3).

even(2).

foo(X) :-   node(X),
            node(A),
            even(A),
            X :- add1(A).

foo(X)?
