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

% block start
empty(start).

% block a
empty(a).

% block b
define(b, bravo).

% block c
define(c, charlie).

% block d
empty(d).

% block e
define(e, echo).

% block end
empty(end).

block(X) :- edge(X, O).
block(X) :- edge(O, X).
var(X)   :- define(O, X).

available(X, D) :- block(X), var(D), define(X, D).
available(Y, D) :- available(X, D), edge(X, Y), empty(Y).

% Test Cases:                    % EXPECTATION:
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
