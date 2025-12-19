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

reachable(D, B) :- define(D, B).

reachable(D, X)?
