/*
Example of how  to link two modules up.
Links two negators in series.
*/
`include "negator.v"
module two_modules(
    input wire in,
    output wire out
);
    /* Fully explicit way. */
    wire middle;
    negator n0 (
        .in(in),
        .out(middle)
    );
    negator n1 (
        .in(middle),
        .out(out)
    );

    /*
    Identical but succint:

    - middle is automatically declared as a wire
    - wires are linked by position instead of name
    */
    /*
    negator n0 (
        in,
        middle
    );
    negator n1 (
        middle,
        out
    );
    */
endmodule
