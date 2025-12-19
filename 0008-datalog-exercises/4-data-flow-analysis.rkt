#lang datalog

% We are given the following control flow graph (CFG) with basic blocks
% { start, A, B, C, D, end }:
%
%      start
%        |
%        v
%        A <------+
%      /    \     |
%     v      v    |
%     B      C    |
%     \      /    |
%      V    V     |
%        D -------+
%        |
%        v
%       end
%
% Suppose we have a variable which is defined in Blocks B and D.
% Which blocks see which definition?
% For clarity, the definition from each block is named phonetically:
%     - definition in block B: 'bravo'
%     - definition in block D: 'delta'

edge(start, a).
edge(a, b).
edge(a, c).
edge(b, d).
edge(c, d).
edge(d, a).
edge(d, end).

% in block b
undefine(delta, b).
define(bravo, b).

% in block d
undefine(bravo, d).
define(delta, d).

% these two relations express which definitions can and cannot flow along a particular edge
flow(D, X, Y) :- edge(X, Y), undefine(D, U), U != Y.
stop(D, X, Y) :- edge(X, Y), undefine(D, Y).

% let's try pushing a value
push(D, X, Y) :- define(D, X), flow(D, X, Y).
push(D, X, Z) :- push(D, X, Y), flow(D, Y, Z).

flow(D, X, Y)?
stop(D, X, Y)?

push(D, X, Y)?

% I think this approach, and the 'flow' predicate, only works when there is
% exactly one undefine of each variable in the entire graph. That allows me to
% say: 'hey, there must be one undefine somewhere, but not here at this node.'
% to decide the ability to flow.
