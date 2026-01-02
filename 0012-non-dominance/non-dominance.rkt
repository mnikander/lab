; Copyright (c) 2026 Marco Nikander

#lang datalog

% Relations

reachable(S, F) :- edge(S, F).
reachable(S, F) :- edge(S, I), reachable(I, F).

% Example Control Flow Graph
%
%           entry
%             |
%             '
%             a
%           /   \
%          '     '
%         b       c
%          \      |
%           \     '
%            \    d
%             \   |
%              '  '
%                e
%
% Note that all edges are directed edges which point downwards.

edge(entry, a).
edge(a, b).
edge(a, c).
edge(b, e).
edge(c, d).
edge(d, e).

reachable(X, Y)?
