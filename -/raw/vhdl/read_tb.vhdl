-- stdin user input

library std;
use std.textio.all;
library ieee;
use ieee.std_logic_1164.all;

entity read_tb is
end;

architecture behav of read_tb is
    constant clk_period : time := 1 ns;
    signal my_integer : integer;
begin
    -- Read 4 integers from stdin and spit them back out.
    --process
        --variable my_line : line;
    --begin
        --for i in 3 downto 0 loop
            --readline(input, my_line);
            --writeline(output, my_line);
        --end loop;
        --wait;
    --end process;

    -- Read 4 integers from stdin and set them to a signal.
    --process
        --variable my_line : line;
        --variable my_integer_var : integer;
    --begin
        --for i in 3 downto 0 loop
            --readline(input, my_line);
            --read(my_line, my_integer_var);
            --my_integer <= my_integer_var;
            --wait for clk_period / 2;
        --end loop;
        --wait;
    --end process;
end;
