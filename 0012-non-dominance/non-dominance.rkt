; Copyright (c) 2026 Marco Nikander

#lang datalog

% Relations
node(N)                  :- edge(N, Other).
node(N)                  :- edge(Other, N).

path(D, F)          :- edge(D, F).
path(D, F)          :- edge(D, I), path(I, F).

split(N) :- edge(N, A), edge(N, B), A != B.
join(N)  :- edge(A, N), edge(B, N), A != B.

path_without(X, E, F) :- node(X), edge(E, F), X != E, X != F.
path_without(X, E, F) :- node(X), edge(E, I), path_without(X, I, F), X != E, X != I, X != F.
path_without(X, E, F) :- node(X), path_without(X, E, I), edge(I, F), X != E, X != I, X != F.  % is this rule necessary?

% Example Control Flow Graph
%
%           entry
%             |
%             '
%             a
%           /   \
%          '     '
%         b       c <---+
%          \      |     |
%           \     '     |
%            \    d ----+
%             \   |
%              '  '
%                e
%
% Note that all edges are directed edges which point downwards.
% In this graph there are the following dominance relations:
% dom(entry, entry).
% dom(entry, a).
% dom(entry, b).
% dom(entry, c).
% dom(entry, d).
% dom(entry, e).
% dom(a, a).
% dom(a, b).
% dom(a, c).
% dom(a, d).
% dom(a, e).
% dom(b, b).
% dom(c, c).
% dom(c, d).
% dom(d, d).
% dom(e, e).
% Note: a non-dominance relation MUST NOT contain any of these, for this particular CFG.

edge(entry, a).
edge(a, b).
edge(a, c).
edge(b, e).
edge(c, d).
edge(d, e).
edge(d, c).

% Queries, sorted by the start node:

_note(0, "list of nodes which have a reachability relation: "). _note(0, X)?
path(entry, X)?
path(a, X)?
path(b, X)?
path(c, X)?
path(d, X)?
path(e, X)?

_?    % insert newline (false) in output

split(N)? _?
join(N)? _?

path_without(entry, E, F)? _?
path_without(a, E, F)? _?
path_without(b, E, F)? _?
path_without(c, E, F)? _?
path_without(d, E, F)? _?
path_without(e, E, F)? _?
