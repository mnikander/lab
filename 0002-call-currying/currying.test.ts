import { expect } from "jsr:@std/expect";
import { Expr, Call, Arg, Node, curry } from "./currying.ts"

Deno.test("do nothing", () => {
    let ast: Call = {
            name: 'root', tag: 'Call',
            fn: { name: '!', tag: 'Node' },
            arg: { name: 'FALSE', tag: 'Arg'}};

    curry(ast);

    expect(ast.name).toBe('root');
    expect(ast.fn.name).toBe('!');
});

Deno.test("curry once", () => {
    let ast: Call = {
        name: 'root',
        tag: 'Call',
        fn: { 
            name: '+',
            tag: 'Node'
        },
        arg: {
            name: '1', 
            tag: 'Arg',
            next: {
                name: '2',
                tag: 'Arg',
            }
        }
    };

    curry(ast);

    expect(ast.name).toBe('root');
    expect(ast.fn.name).toBe('inner');
    expect((ast.fn as Call).fn.name).toBe('+');
    expect((ast.fn as Call).arg.name).toBe('1');
    expect(ast.arg.name).toBe('2');
});

Deno.test("curry twice", () => {
    let ast: Call = {
        name: 'root',
        tag: 'Call',
        fn: { 
            name: 'f',
            tag: 'Node'
        },
        arg: {
            name: '1', 
            tag: 'Arg',
            next: {
                name: '2',
                tag: 'Arg',
                next: {
                    name: '3',
                    tag: 'Arg',
                }
            }
        }
    };

    curry(ast);

    expect(ast.name).toBe('root');
    expect(ast.fn.name).toBe('inner');
    expect((ast.fn as Call).fn.name).toBe('inner');
    expect(((ast.fn as Call).fn as Call).fn.name).toBe('f');
    expect(((ast.fn as Call).fn as Call).arg.name).toBe('1');
    expect((ast.fn as Call).arg.name).toBe('2');
    expect(ast.arg.name).toBe('3');
});
