`include "ram.v"

module ram_tb;
    localparam ADDRESS_BITS = 1;
    localparam DATA_BITS = 1;

    reg clock, reset, write;
    reg [ADDRESS_BITS-1:0] address;
    reg [DATA_BITS-1:0] data;
    wire [DATA_BITS-1:0] dataw;
    ram top (
        clock,
        reset,
        write,
        address,
        dataw
    );
    assign dataw = (write == 1) ? data : {DATA_BITS{1'bz}};

    initial begin
        $dumpfile("ram_tb.vcd");
        $dumpvars;

        /* Start. */
        clock = 0;
        reset = 0;
        write = 0;

        /* Reset. */
        #2 reset = 1;
        #2 reset = 0;

        /* data[0] = 1. */
        #1
        address = 0;
        data = 1;
        #1 write = 1;
        #2 write = 0;
        #1 address = 0;
        #1 address = 1;

        /* data[1] = 1. */
        #1
        address = 1;
        data = 1;
        #1 write = 1;
        #2 write = 0;
        #1 address = 0;
        #1 address = 1;

        /* data[0] = 0. */
        #1
        address = 0;
        data = 0;
        #1 write = 1;
        #2 write = 0;
        #1 address = 0;
        #1 address = 1;

        /* data[0] = 1; data[1] = 0; */
        #1
        address = 0;
        data = 1;
        #1 write = 1;
        #2
        address = 1;
        data = 0;
        #2 write = 0;
        #1 address = 0;
        #1 address = 1;

        #2 $finish;
    end

    always begin
        #1 clock = ~clock;
    end
endmodule
