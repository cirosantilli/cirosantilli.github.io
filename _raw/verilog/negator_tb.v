`include "negator.v"

module negator_tb;
    reg clock;
    wire out;
    negator top (
        clock,
        out
    );

    initial begin
        $dumpfile("negator_tb.vcd");
        $dumpvars;
        clock = 0;
        #10 $finish;
    end

    always begin
        #1 clock = ~clock;
    end
endmodule
