`include "negator.v"
module monitor_tb();
    reg clock;
    wire out;

    initial begin
        $monitor("%g %b %b", $time, clock, out);
        clock = 0;
        #3 $finish;
    end

    always begin
        #1 clock = ~clock;
    end

    negator top (
        clock,
        out
    );
endmodule
