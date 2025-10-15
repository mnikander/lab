export function adder(bias: number) {
    return function (x: number) {
        return bias + x;
    }
}
