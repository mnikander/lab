#lang datalog

parent(john, douglas).
parent(bob, john).
parent(ebbon, bob).

ancestor(A, D) :- parent(A, D).
ancestor(A, D) :- parent(A, B), ancestor(B, D).

parent(bob, john)~

ancestor(A, B)?
