`include "ram_dual.v"

module ram_dual_tb;
    localparam ADDRESS_BITS = 1;
    localparam DATA_BITS = 1;

    reg clock, reset, write;
    reg [ADDRESS_BITS-1:0] address_in, address_out;
    reg [DATA_BITS-1:0] data_in;
    wire [DATA_BITS-1:0] data_out;
    ram_dual #(
        .ADDRESS_BITS(ADDRESS_BITS),
        .DATA_BITS(DATA_BITS)
    ) top (
        clock,
        reset,
        write,
        address_in,
        address_out,
        data_in,
        data_out
    );

    initial begin
        $dumpfile("ram_dual_tb.vcd");
        $dumpvars;

        /* Start. */
        address_in = 0;
        address_out = 0;
        data_in = 0;
        clock = 0;
        reset = 0;
        write = 0;

        /* Reset. */
        #2 reset = 1;
        #2 reset = 0;

        #2
        write = 1;
        address_out = 1;
        address_in = 0;
        data_in = 1;
        #2
        write = 0;
        address_out = 0;
        address_in = 1;
        data_in = 1;

        #2 $finish;
    end

    always begin
        #1 clock = ~clock;
    end
endmodule
