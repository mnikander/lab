grammar Blocky

entry Block:
    '{' (lets+=Let)* tail=TailExpr '}';

Let:
    'let' ID '=' Expression 'in';

TailExpr:
    Expression | Conditional;

Atom:
    value=('unit' | INT | ID | Unary | Arithmetic | Comparison | Abstraction | Block);

Expression:
    Atom | Application;

Abstraction:
    'fun' (params+=ID)* expr=Block;

Application:
    fun=Atom (args+=Expression)+;

Unary:
    op='~' args+=Expression;

Arithmetic:
    op=('+' | '-' | '*' | '/' | '%' | 'min' | 'max') args+=Expression args+=Expression;

Comparison:
    op=('<' | '>' | '<=' | '>=' | '==' | '!=') args+=Expression args+=Expression;

Conditional:
    'if' condition=Expression 'then' thenExpr=Expression 'else' elseExpr=Expression;

hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /-?[0-9]+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;

// Examples:
//
// {+ 1 2}
// {+ 1 {+ 2 3}}
// { + 1 { let x = + 2 3 in x } }
// { + 1 { let x = + 1 2 in   let y = + x 1 in   if {< x y} then x else y} }
// { call fun x {+ x 1} 2}
// { call fun x {unit} 2}
// { let increment = fun x { add x 1 } in    let compute   = fun   { increment 41 } in    compute unit }
