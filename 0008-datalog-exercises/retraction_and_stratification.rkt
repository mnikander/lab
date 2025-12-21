#lang datalog

% assert facts
node(1).
node(2).
node(3).

% query
node(X)?

% retract facts
node(2)~
node(3)~

% query again
node(X)?
