-- VHDL 2008 9.2 Operators
-- Overloaded for several types.

library std;
use std.textio.all;

entity operators_tb is
end operators_tb;

architecture behav of operators_tb is
begin
    process
        constant err : real := 1.0E-6;
    begin
        assert 1 + 1 = 2;

        assert 2 * 2 = 4;

        assert 2 ** 3 = 8;
        assert abs((2.0 ** 3) - 8.0) < err;

        assert abs(-1) = 1;
        assert abs(-1.0) = 1.0;

        assert 3 / 2 = 1;
        assert abs((3.0 / 2.0) - 1.5) < err;

        -- TODO condition operator, converts bit to from true / false.
        --assert (??(bit'('1')));

        wait;
    end process;
end behav;
