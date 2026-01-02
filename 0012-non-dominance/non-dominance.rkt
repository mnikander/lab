; Copyright (c) 2026 Marco Nikander

#lang datalog

% Relations

node(N)                    :- edge(N, Other).
node(N)                    :- edge(Other, N).

path(N, N)                 :- node(N).
path(N, O)                 :- edge(N, I), path(I, O).

split(N)                   :- edge(N, A), edge(N, B), A != B.
join(N)                    :- edge(A, N), edge(B, N), A != B.

path_without(X, S, S)      :- node(X), node(S), X != S.
path_without(X, S, F)      :- node(X), edge(S, I), path_without(X, I, F), X != S, X != I, X != F.

% aggressively filters paths for which no relevant dominators X can exist:
reachable_without(X, S, F) :- path(S, X), path(X, F), path_without(X, S, F).

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

split(N)? _?
join(N)? _?

_? % print newline
_note(0, "tuples `(S, F)` where there exists a path from `S` to `F` "). _note(0, X)?
_? % print newline

path(entry, X)?
path(a, X)?
path(b, X)?
path(c, X)?
path(d, X)?
path(e, X)?

_? % print newline
_note(1, "tuples `(X, entry, F)` where there exists a path from `X` to `F`, but `X` does _NOT_ dominate `F` "). _note(1, X)?
_? % print newline

reachable_without(foo, entry, F)?
reachable_without(a, entry, F)?
reachable_without(b, entry, F)?
reachable_without(c, entry, F)?
reachable_without(d, entry, F)?
reachable_without(e, entry, F)?
