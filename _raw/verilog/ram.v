/*
Zero delay, single channel RAM.

Modelling RAM in verilog is basically useless, as real RAM has
delays and we would have to create a ugly state machine to model that.

A Verilator C++ behavioural model is much better.
*/
module ram #(
    parameter ADDRESS_BITS = 1,
    parameter DATA_BITS = 1
) (
    input wire clock,
    input wire reset,
    input wire write,
    input wire [ADDRESS_BITS-1:0] address,
    inout wire [DATA_BITS-1:0] data
);
    localparam MEMORY_BITS = DATA_BITS * (1 << ADDRESS_BITS);

    reg [MEMORY_BITS-1:0] memory;

    assign data = (write == 1) ? {DATA_BITS{1'bz}} : memory[address];

    always @ (posedge clock) begin
        if (reset == 1) begin
            memory <= {MEMORY_BITS{1'b0}};
        end
        else if (write == 1) begin
            memory[address] <= data;
        end
    end
endmodule
