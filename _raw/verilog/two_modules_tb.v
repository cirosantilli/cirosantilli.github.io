`include "two_modules.v"
module two_modules_tb();
    reg clock;
    wire out;

    initial begin
        $dumpfile("two_modules_tb.vcd");
        $dumpvars;
        clock = 0;
        #10 $finish;
    end

    always begin
        #1 clock = ~clock;
    end

    two_modules top (
        clock,
        out
    );
endmodule
