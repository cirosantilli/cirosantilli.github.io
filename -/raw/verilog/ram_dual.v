/*
Zero delay, dual channel RAM.

Dual channel is simpler to design as it does not have to deal with Z.

You will need RAM's for all non-trivial designs.
*/
module ram_dual #(
    parameter ADDRESS_BITS = 1,
    parameter DATA_BITS = 1
) (
    input wire clock,
    input wire reset,
    input wire write,
    input wire [ADDRESS_BITS-1:0] address_in,
    input wire [ADDRESS_BITS-1:0] address_out,
    input wire [DATA_BITS-1:0] data_in,
    output wire [DATA_BITS-1:0] data_out
);
    localparam MEMORY_BITS = DATA_BITS * (1 << ADDRESS_BITS);

    reg [MEMORY_BITS-1:0] memory;

    assign data_out = memory[address_out];

    always @ (posedge clock) begin
        if (reset == 1) begin
            memory <= {MEMORY_BITS{1'b0}};
        end
        else if (write == 1) begin
            memory[address_in] <= data_in;
        end
    end
endmodule
