`include "counter.v"
module counter_tb;
    localparam BITS = 2;

    reg clock, reset, enable;
    wire [BITS-1:0] out;
    counter #(
        .BITS(BITS)
    ) top (
        clock,
        reset,
        enable,
        out
    );

    always begin
        #1 clock = ~clock;
    end

    initial begin
        $dumpfile("counter_tb.vcd");
        $dumpvars;
        clock = 0;
        reset = 0;
        enable = 0;
        #2 reset = 1;
        #2 reset = 0;
        #2 enable = 1;
        #(4<<BITS) $finish;
    end
endmodule
