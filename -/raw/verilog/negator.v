/* The simplest non-identity combinatorial circuit. */
module negator(
    input wire in,
    output wire out
);
    assign out = ~in;
endmodule
