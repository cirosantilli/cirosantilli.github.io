/* https://cirosantilli.com/verilog */
module counter #(
    parameter BITS = 1
) (
    /* All the input ports should be wires. */
    input wire clock,
    input wire reset,
    input wire enable,
    output reg [BITS-1:0] out
);
    /* Do this on every positive edge. */
    always @ (posedge clock) begin
        if (reset == 1'b1) begin
            out <= {BITS{1'b0}};
        end
        else if (enable == 1) begin
            out <= out + 1;
        end
    end
endmodule
