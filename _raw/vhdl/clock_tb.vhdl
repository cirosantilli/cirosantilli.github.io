-- http://stackoverflow.com/questions/17904514/vhdl-how-should-i-create-a-clock-in-a-testbench
-- A clock is not synthesizable in VHDL:
-- It is physically implemented as a magic quartz crystal vibration phenomenon.

library ieee;
use ieee.std_logic_1164.all;

entity clock_tb is
end;

architecture behav of clock_tb is
    constant clk_period : time := 1 ns;
    signal clk: std_logic := '0';
begin
    process
    begin
        for i in 13 downto 0 loop
            clk <= not clk;
            wait for clk_period / 2;
        end loop;
        wait;
    end process;
end;
