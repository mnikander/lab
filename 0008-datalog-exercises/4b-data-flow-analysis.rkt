// Copyright (c) 2025 Marco Nikander

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

edge(start, a).
edge(a, b).
edge(a, c).
edge(a, d).
edge(b, e).
edge(c, e).
edge(d, e).
edge(e, a).
edge(e, end).

% Suppose we have a single variable 'k' which is defined in Blocks B, C, and E.
% These definitions thus override each other.
% Which block sees which definition?
% Definitions of 'k' for every block, with explicit predicate to mark when 'k' is NOT defined / overriden.
% For clarity, the definition of 'k' from each block is named phonetically:
%     - definition in block B: 'bravo'
%     - definition in block C: 'charlie'
%     - definition in block E: 'echo'

nothing(start).
nothing(a).
define(b, bravo).
define(c, charlie).
nothing(d).
define(e, echo).
nothing(end).

% type predicates
block(X) :- edge(X, O).
block(X) :- edge(O, X).
var(X)   :- define(O, X).

% project forward from the point of definition through any blocks which don't have overriding definitions
available(X, D) :- block(X), var(D), define(X, D).
available(Y, D) :- available(X, D), edge(X, Y), nothing(Y).

% Test Cases:                % EXPECTATION:
available(start, bravo)?     %
available(start, charlie)?   %
available(start, echo)?      %
available(a, bravo)?         %
available(a, charlie)?       %
available(a, echo)?          % true
available(b, bravo)?         % true
available(b, charlie)?       %
available(b, echo)?          %
available(c, bravo)?         %
available(c, charlie)?       % true
available(c, echo)?          %
available(d, bravo)?         %
available(d, charlie)?       %
available(d, echo)?          % true
available(e, bravo)?         %
available(e, charlie)?       %
available(e, echo)?          % true
available(end, bravo)?       %
available(end, charlie)?     %
available(end, echo)?        % true
