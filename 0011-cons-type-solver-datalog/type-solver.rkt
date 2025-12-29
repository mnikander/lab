; Copyright (c) 2025 Marco Nikander

#lang datalog


% Type definitions

% Definition of the unit type, i.e. the empty value 'nil':
in(nil, unit).

% Definition of type i1, i.e. booleans, which is {0, 1}
in(0, i1). in(1, i1).

% Definition of type i4, which is {0, 1, 2, 3, 4, 5, 6, 7}
in(0, i4). in(1, i4). in(2, i4). in(3, i4). in(4, i4). in(5, i4). in(6, i4). in(7, i4).


% Relations:
%
%    atom(id, value)
%    func(id)
%    cons(id, left, right)
%    type(id, typename)
%    call(id, function, arguments)
%
% Note that all ids are assumed to be unique. This _MUST_ be ensured beforehand.


% Type solver, with 3 cases: simple atom, function declaration, function call
typeof(Id, Type) :- atom(Id, Value),    type(Id, Type), in(Value, Type).
typeof(Id, Type) :- func(Id),           type(Id, Type), cons(Type, Sig_first, Sig_rest).
typeof(Id, Type) :- call(Id, Fn, Args), type(Id, Type), func(Fn), type(Fn, Sig_Fn), match(Sig_Fn, Args, Type).


% Helper function which recurses and matches every argument to the corresponding entry in the type signature
match(S, Arg, Discard) :- atom(Arg, V), in(V, S), in(X, Discard).
match(Sig, nil , T)    :- cons(Sig, T_other, nil), in(Discard, T), T_other = T.
match(Sig, Args, T)    :- cons(Sig, S_first, S_rest), cons(Args, A_first, A_rest), match(S_first, A_first, T), match(S_rest, A_rest, T).


% Function declarations

%   unary : i1 -> i1
func(unary). type(unary, sig_u0). cons(sig_u0, i1, sig_u1). cons(sig_u1, i1, nil).

%  binary : i1 -> i1 -> i1
func(binary ). type(binary , sig_b0). cons(sig_b0, i1, sig_b1). cons(sig_b1, i1, sig_b2). cons(sig_b2, i1, nil).


% Define atoms and cons-cells

atom(a, 0).                % ok
type(a, i1).

atom(b, 1).                % ok
type(b, i1).

atom(c, nil).              % error
type(c, i1).

atom(d, 666).              % error
type(d, i1).


% Call unary function

call(e, unary, arg_e0).     % ok
type(e, i1).
cons(arg_e0, a, nil).

call(f, unary, arg_f0).     % ok
type(f, i1).
cons(arg_f0, b, nil).

call(g, unary, arg_g0).     % error
type(g, i4).
cons(arg_g0, b, nil).


% Call binary function

call(j, binary, arg_j0).      % ok
type(j, i1).
cons(arg_j0, a, arg_j1).
cons(arg_j1, b, nil).

call(k, binary, arg_k0).      % error
type(k, i4).
cons(arg_k0, a, arg_k1).
cons(arg_k1, b, nil).

call(l, binary, arg_l0).      % error
type(l, i1).
cons(arg_l0, b, nil).


% Query to list all type-able variables
typeof(X, Sig)?
