-- VHDL 2008 (informative) G.2 Using the STD_LOGIC_1164 package
-- http://electronics.stackexchange.com/questions/51848/when-to-use-std-logic-over-bit-in-vhdl/241653#241653

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all; -- unsigned

entity std_logic_tb is
end std_logic_tb;

architecture behav of std_logic_tb is
    signal s0 : std_logic;
    signal s1 : bit;
    signal my_std_logic_vector : std_logic_vector (0 to 2);
begin
    s0 <= '0';
    s0 <= '1';
    s1 <= '0';
    -- Simulation error.
    --s1 <= '1';
    process
    begin
        wait for 1 ns;
        assert s0 = 'X';

        -- # std_logic_vector

            -- TYPE std_logic_vector IS ARRAY ( NATURAL RANGE <>) OF std_logic;

            -- Initialize.
            my_std_logic_vector <= "01X";
            wait for 1 ns;
            assert my_std_logic_vector(0) = '0';
            assert my_std_logic_vector(1) = '1';
            assert my_std_logic_vector(2) = 'X';

            -- To unsigned / signed.
            assert unsigned(std_logic_vector'(B"011")) + 1 = 4;

        wait;
    end process;
end behav;
