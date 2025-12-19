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
undefine(b, charlie).
undefine(b, echo).
define(b, bravo).

% block c
undefine(c, bravo).
undefine(c, echo).
define(c, charlie).

% block d
empty(d).

% block e
undefine(e, bravo).
undefine(e, charlie).
define(e, echo).

% block end
empty(end).

stop(X, Y, D) :- edge(X, Y), undefine(Y, D).

block(X) :- edge(X, O).
block(X) :- edge(O, X).
var(X)   :- define(O, X).
var(X)   :- undefine(O, X).

available(X, D) :- block(X), var(D), define(X, D).
available(Y, D) :- available(X, D), edge(X, Y), empty(Y).

% Test Cases:                    % EXPECTATION:
available(start, bravo)?     %
available(start, charlie)?   %
available(start, echo)?      %
available(a, bravo)?         %
available(a, charlie)?       %
available(a, echo)?          % true       <-- this one always caused trouble
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
