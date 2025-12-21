#lang datalog/sexp

(! (node 1))
(! (node 2))
(! (node 3))

(! (even 2))


(! (edge 1 2))
(! (edge 2 3))
(! (:- (reachable A B) (edge A B)))
(! (:- (reachable A C) (edge A B) (reachable B C)))

(! (:- (foo B) (node A) (node B) (add1 A :- B)))

(? (foo A))
