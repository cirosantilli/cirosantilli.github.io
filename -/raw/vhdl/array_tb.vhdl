-- VHDL 2008 5.3.2 Array types

library ieee;
use ieee.numeric_bit.all; -- unsigned

entity array_tb is
end array_tb;

architecture behav of array_tb is
    -- Fixed width.
    type bit4_t is array (0 to 3) of bit;

    -- Indetermined width.
    type bitx_t is array (integer range <>) of bit;

begin
    process is
        variable bit4 : bit4_t;
        variable bitx4 : bitx_t (0 to 3);
        variable bitx4_downto : bitx_t (3 downto 0);
        variable my_bit_vector : bit_vector (0 to 3);
    begin
        -- Fixed length.

            -- Initialize element by element.
            bit4 := (0 => '1', 1 => '0', others => '1');

            -- Initialize with bit string literal.
            assert bit4 = B"1011";

            -- Access elements.
            assert bit4(0) = '1';
            assert bit4(1) = '0';
            assert bit4(2) = '1';
            assert bit4(3) = '1';

            -- Set element.
            bit4(0) := '0';
            assert bit4(0) = '0';
            bit4(0) := '1';
            assert bit4(0) = '1';

            -- Compile time error.
            --assert bit4(4) = '0';

        --  Variable length

            bitx4 := B"1000";
            assert bitx4(0) = '1';

        --  downto

            -- The bit indexing is reversed!

            bitx4_downto := B"1000";
            assert bitx4_downto(0) = '0';

        -- # length attribute for arrays.

            assert bit4'length = 4;
            assert bitx4'length = 4;

        -- # + operator.

            bit4 := B"1001";

            -- Nope.
            --bit4 := bit4 + bit4;

            -- Yup.
            assert unsigned(bit_vector'(B"011")) + 1 = 4;

            -- Cary done line this.
            -- result <= ('0' & A) + ('0' & B);
            -- sum <= result(n-1 downto 0);
            -- carry <= result(n);

        wait;
    end process;
end behav;
