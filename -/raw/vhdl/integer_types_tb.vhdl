entity integer_types_tb is
end integer_types_tb;

architecture behav of integer_types_tb is
    -- All integers have a fixed range.
    type int_0_2_t is range 0 to 2;
    type int_0_3_t is range 0 to 3;
    type int_1_3_t is range 1 to 3;
begin
    process is
        variable int_0_2 : int_0_2_t;
        variable int_0_3 : int_0_3_t;
        variable int_1_3 : int_1_3_t;
    begin
        -- # Integer overflow

            -- Runtime error:
            -- http://stackoverflow.com/questions/13446580/is-integer-overflow-defined-in-vhdl
            --int_0_2 := 3;

            -- Overflow seems to be well defined for signed and unsigned however.

        -- # signed

        -- # unsigned

            -- TODO how are those defined? Looks like oveflow is well 2-complement defined for those.
        wait;
    end process;
end behav;
