// Copyright (c) 2025 Marco Nikander

export type Expr = Call | Arg | Node;
export type Call = { name: string, tag: 'Call', fn: Expr, arg: Arg };
export type Node = { name: string, tag: 'Node', left?: Expr, right?: Expr };
export type Arg  = { name: string, tag: 'Arg', next?: Arg };

export function curry(ast: Expr): void {
    if (ast.tag === 'Call') {
        if (ast.arg.next) {
            
            // I need to grab the last entry in the argument list
            let prev: Arg = ast.arg;
            let last: Arg = ast.arg.next;
            while (last.next) {
                prev = last;
                last = last.next;
            }
            prev.next = undefined; // remove the last entry from the argument list
            
            ast.fn = {
                name: 'inner',
                tag: 'Call',
                fn: ast.fn,
                arg: ast.arg
            };
            ast.arg = last;
            curry(ast.fn);
            curry(ast.arg);
        }
    }
    else if (ast.tag === 'Arg') {
        if (ast.next) {
            curry(ast.next);
        }
    }
    else if (ast.tag === 'Node') {
        if (ast.left && ast.right) {
            curry(ast.left);
            curry(ast.right);
        }
        else if (ast.left && !ast.right) {
            curry(ast.left);
        }
        else if (!ast.left && ast.right) {
            curry(ast.right);
        }
    }
    else {
        throw Error('unhandled case');
    }
}
