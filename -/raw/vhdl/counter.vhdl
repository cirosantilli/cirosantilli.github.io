-- Adapted from: https://en.wikipedia.org/wiki/VHDL#Example:_a_counter

library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all; -- unsigned

entity counter is
    generic (
        width : in natural := 2
    );
    port (
        rst, clk, load : in std_logic;
        data : in std_logic_vector(width-1 downto 0);
        count : out std_logic_vector(width-1 downto 0)
    );
end entity counter;

architecture rtl of counter is
    signal cnt : unsigned(width-1 downto 0);
begin
    process(rst, clk) is
    begin
        if rst = '1' then
            cnt <= (others => '0');
        elsif rising_edge(clk) then
            if load = '1' then
                cnt <= unsigned(data);
            else
                cnt <= cnt + 1;
            end if;
        end if;
    end process;
    count <= std_logic_vector(cnt);
end architecture rtl;
