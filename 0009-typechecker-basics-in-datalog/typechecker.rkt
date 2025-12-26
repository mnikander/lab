#lang datalog

% definition of type i1, i.e. booleans
i1(0).
i1(1).

% definition of type i4
i4(0).
i4(1).
i4(2).
i4(3).
i4(4).
i4(5).
i4(6).
i4(7).

% queries
i1(X)?
i4(X)?
i1(42)?
i4(42)?
