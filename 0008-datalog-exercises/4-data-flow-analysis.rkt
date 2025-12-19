#lang datalog

% We are given the following control flow graph (CFG) with basic blocks
% { start, B1, B2, B3, B4, end }:
%
%      start
%        |
%        V
%        B1 <-----+
%      /    \     |
%     V      V    |
%    B2      B3   |
%     \      /    |
%      V    V     |
%        B4 ------+
%        |
%        V
%       end
%
% Suppose we have a variable 'D' which is defined in Blocks B2 and B4.
% Which blocks see which definition?

edge(start, b1).
edge(b1, b2).
edge(b1, b3).
edge(b2, b4).
edge(b3, b4).
edge(b4, b1).
edge(b4, end).

% in block b2
undefine(d2, b2).
define(d1, b2).

% in block b4
undefine(d1, b4).
define(d2, b4).

% these two relations express which definitions can and cannot flow along a particular edge
% I think they only work when there is exactly one undefine in the entire graph
flow(D, X, Y) :- edge(X, Y), undefine(D, U), U != Y.
stop(D, X, Y) :- edge(X, Y), undefine(D, Y).

% let's try pushing a value
push(D, X, Y) :- define(D, X), flow(D, X, Y).
push(D, X, Z) :- push(D, X, Y), flow(D, Y, Z).

flow(D, X, Y)?
stop(D, X, Y)?

push(D, X, Y)?
