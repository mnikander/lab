#lang datalog

q(X) :- p(X).
p(X) :- q(X).
q(a).

q(X)?
