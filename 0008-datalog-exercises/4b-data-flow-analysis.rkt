#lang datalog

% We are given the following control flow graph (CFG) with basic blocks
% { start, A, B, C, D, E, end }:
%
%            start
%              |
%              v
%     +------- A <-----+
%     |      /   \     |
%     v     v     v    |
%     B     C     D    |
%     |     \     /    |
%     |      V   V     |
%     +------> E ------+
%              |
%              v
%             end
%
% Suppose we have a variable which is defined in Blocks B, C, and E.
% Which blocks see which definition?
% For clarity, the definition from each block is named phonetically:
%     - definition in block B: 'bravo'
%     - definition in block C: 'charlie'
%     - definition in block E: 'echo'

edge(start, a).
edge(a, b).
edge(a, c).
edge(a, d).
edge(b, e).
edge(c, e).
edge(d, e).
edge(e, a).
edge(e, end).

% in block b
undefine(charlie, b).
undefine(echo, b).
define(bravo, b).

% in block c
undefine(bravo, c).
undefine(echo, c).
define(charlie, c).

% in block e
undefine(bravo, e).
undefine(charlie, e).
define(echo, e).

% these two relations express which definitions can and cannot flow along a particular edge
% 'flow', as defined here, only works when there is exactly one 'undefine' in the entire graph
flow(D, X, Y) :- edge(X, Y), undefine(D, U), U != Y.
stop(D, X, Y) :- edge(X, Y), undefine(D, Y).

% let's try pushing a value
push(D, X, Y) :- define(D, X), flow(D, X, Y).
push(D, X, Z) :- push(D, X, Y), flow(D, Y, Z).

% do I have to define 'pull' in terms of 'stop'?
% that's going to be tricky without stratified negation
% I might be able to work around it with equality and inequality and an extra indirection

cannot_pull(D, X, Y) :- edge(X, Y), stop(D, X, Y).

%flow(D, X, b)?
%stop(D, X, b)?
cannot_pull(D, X, Y)?

% An interesting note is that there can be an arbitrary number of incoming
% edges, but if you only have (1) an unconditional jump and (2) a binary branch
% instruction, then there are exactly 1 or 2 edges leading out of a block.
% This could be of enourmous significance in terms of what you can and cannot
% test, depending on the direction in which you traverse the CFG.
