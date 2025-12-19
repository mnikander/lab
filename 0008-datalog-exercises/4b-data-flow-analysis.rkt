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

% block b
undefine(b, charlie).
undefine(b, echo).
define(b, bravo).

% block c
undefine(c, bravo).
undefine(c, echo).
define(c, charlie).

% block e
undefine(e, bravo).
undefine(e, charlie).
define(e, echo).

stop(X, Y, D) :- edge(X, Y), undefine(Y, D).

node(X) :- edge(X, O).
node(X) :- edge(O, X).
var(X)  :- define(O, X).
var(X)  :- undefine(O, X).

% If I really wanted to trace what is availble where, and don't have negation,
% then I would have to change what the nodes encode. Instead of having some
% nodes encode "you shall not pass", I would have to explicitly encode in most
% nodes that "you are allowed to pass". 

% assuming there is only a single definition, I can use some tricks:
defined_elsewhere(X, D) :- node(X), var(D), define(O, D), O != X.

not_available(X, D) :- node(X), var(D), X = start.
not_available(X, D) :- undefine(X, D).
not_available(Y, D) :- not_available(X, D), edge(X, Y), defined_elsewhere(Y, D).

% The problem with that 3rd definition is that as soon as one incoming branch
% exists where the variable is not defined, for example a branch from 'start'
% then the variable gets labeled as 'not availble', even if another incoming
% edge defines it.

% Test Cases:                    % EXPECTATION:
not_available(start, bravo)?     % true
not_available(start, charlie)?   % true
not_available(start, echo)?      % true
not_available(a, bravo)?         % true
not_available(a, charlie)?       % true
not_available(a, echo)?          %        <-- this one causes trouble
not_available(b, bravo)?         %
not_available(b, charlie)?       % true
not_available(b, echo)?          % true
not_available(c, bravo)?         % true
not_available(c, charlie)?       %
not_available(c, echo)?          % true
not_available(d, bravo)?         % true
not_available(d, charlie)?       % true
not_available(d, echo)?          %
not_available(e, bravo)?         % true
not_available(e, charlie)?       % true
not_available(e, echo)?          %
not_available(end, bravo)?       % true
not_available(end, charlie)?     % true
not_available(end, echo)?        %
