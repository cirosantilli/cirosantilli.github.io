/**
 * @param write If true, data will be written to memory.
 *              Else, data will be read.
 * @param halt If true, the device has entered an single instruction infinite loop.
 *             No further changes will be made to memory until reset.
 * */
module subleq #(
    parameter BITS = 1
) (
    input wire clock,
    input wire reset,
    output wire halt,
    output wire write,
    output wire [BITS-1:0] address,
    inout wire [BITS-1:0] data
);
    enum reg [1:0] {
        STAGE_READ_A,
        STAGE_READ_B,
        STAGE_READ_C,
        STAGE_WRITE
    } stage;
    reg [BITS-1:0] pc, a, b, c;
    reg halt_reg;

    wire signed [BITS-1:0] b_next;

    assign address =
        (stage == STAGE_READ_A) ? pc + BITS'(0) :
        (stage == STAGE_READ_B) ? pc + BITS'(1) :
        (stage == STAGE_READ_C) ? pc + BITS'(2) :
        b
    ;
    assign b_next = b - a;
    assign data = write ? b_next : {BITS{1'bz}};
    assign halt = halt_reg;
    assign write = stage == STAGE_WRITE;

    always @(posedge clock) begin
        if (reset == 1'b1) begin
            halt_reg <= 0;
            pc <= 0;
            stage <= STAGE_READ_A;
        end else begin
            case(stage)
                STAGE_READ_A: a <= data;
                STAGE_READ_B: b <= data;
                STAGE_READ_C: c <= data;
                STAGE_WRITE: pc <= (b_next <= 0) ? c : pc + BITS'(3);
            endcase
            if (stage == STAGE_WRITE && a == 0 && b <= 0 && c == pc) begin
                halt_reg <= 1;
            end
            stage <= stage + 1;
        end
    end
endmodule
