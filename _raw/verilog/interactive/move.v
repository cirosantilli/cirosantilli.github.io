module move(
    input wire clock,
    input wire reset,
    input wire up,
    input wire down,
    input wire left,
    input wire right,
    output reg [1:0] x,
    output reg [1:0] y
);
    always @ (posedge clock) begin
        if (reset == 1'b1) begin
            x <= 0;
            y <= 0;
        end
        else begin
            if (up == 1'b1) begin
                y <= y - 1;
            end
            if (down == 1'b1) begin
                y <= y + 1;
            end
            if (left == 1'b1) begin
                x <= x - 1;
            end
            if (right == 1'b1) begin
                x <= x + 1;
            end
        end
    end
endmodule
