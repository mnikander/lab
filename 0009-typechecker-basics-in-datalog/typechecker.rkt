#lang datalog

% definitions
variable(X) :- let(X, O).
variable(X) :- function(X, O).

type(T)     :- cons(T, A, B), type(A), type(B).
type(red).
type(green).
type(blue).

% foo :: green -> green
% bar :: red   -> green -> blue
%
% let r: red   = empty
% let g: green = empty
% let b: blue  = empty
%
% let i: green = (foo g)
% let j: blue  = (foo g)  % error

% variable bindings
let(r, red  , empty).
let(g, green, empty).
let(b, blue , empty).

% function foo
cons(sig_foo, green, green).
function(foo, sig_foo).

% calls to 'foo'
call(c0, foo, green).
call(c1, foo, blue).

type(X)?
