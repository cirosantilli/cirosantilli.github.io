-- Adapted from.
-- Input: 8-bit unsigned
-- Output: 4-bit unsigned int floor(sqrt(x))

library ieee;
use ieee.std_logic_1164.all;

-- Subtractor Multiplexor
entity sm is
    port (
        x  : in  std_logic;
        y  : in  std_logic;
        b  : in  std_logic;
        u  : in  std_logic;
        d  : out std_logic;
        bo : out std_logic
    );
end sm;

architecture rtl of sm is
    signal t011, t111, t010, t001, t100, td : std_logic;
begin
    t011 <= (not x) and y and b;
    t111 <= x and y and b;
    t010 <= (not x) and y and (not b);
    t001 <= (not x) and (not y) and b;
    t100 <= x and (not y) and (not b);
    bo   <= t011 or t111 or t010 or t001;
    td   <= t100 or t001 or t010 or t111;
    d    <= td when u='1' else x;
end architecture rtl;

--

library ieee;
use ieee.std_logic_1164.all;

entity sqrt8 is
    port (
        p : in  std_logic_vector(7 downto 0);
        u : out std_logic_vector(3 downto 0)
    );
end sqrt8;

architecture rtl of sqrt8 is
    signal zer : std_logic := '0';
    signal one : std_logic := '1';
    signal x00, x01, x02, x03, x04, x05, u_0 : std_logic;
    signal b00, b01, b02, b03, b04, b05 : std_logic;
    signal x12, x13, x14, x15, x16, u_1 : std_logic;
    signal b12, b13, b14, b15, b16 : std_logic;
    signal x24, x25, x26, x27, u_2 : std_logic;
    signal b24, b25, b26, b27 : std_logic;
    signal x36, x37, u_3 : std_logic;
    signal b36, b37 : std_logic;
begin
    --                           x     y    b    u    d    bo
    s36: entity work.sm port map(p(6), one, zer, u_3, x36, b36);
    s37: entity work.sm port map(p(7), zer, b36, u_3, x37, b37);

    s24: entity work.sm port map(p(4), one, zer, u_2, x24, b24);
    s25: entity work.sm port map(p(5), zer, b24, u_2, x25, b25);
    s26: entity work.sm port map(x36 , u_3, b25, u_2, x26, b26);
    s27: entity work.sm port map(x37 , zer, b26, zer, x27, b27);

    s12: entity work.sm port map(p(2), one, zer, u_1, x12, b12);
    s13: entity work.sm port map(p(3), zer, b12, u_1, x13, b13);
    s14: entity work.sm port map(x24 , u_2, b13, u_1, x14, b14);
    s15: entity work.sm port map(x25 , u_3, b14, u_1, x15, b15);
    s16: entity work.sm port map(x26 , zer, b15, zer, x16, b16);

    s00: entity work.sm port map(p(0), one, zer, zer, x00, b00);
    s01: entity work.sm port map(p(1), zer, b00, zer, x01, b01);
    s02: entity work.sm port map(x12 , u_1, b01, zer, x02, b02);
    s03: entity work.sm port map(x13 , u_2, b02, zer, x03, b03);
    s04: entity work.sm port map(x14 , u_3, b03, zer, x04, b04);
    s05: entity work.sm port map(x15 , zer, b04, zer, x05, b05);

    u_0  <= not b05;
    u_1  <= not b16;
    u_2  <= not b27;
    u_3  <= not b37;

    u(0) <= u_0;
    u(1) <= u_1;
    u(2) <= u_2;
    u(3) <= u_3;

end architecture rtl;

--

library std;
use std.textio.all;
library ieee;
use ieee.std_logic_1164.all;
use ieee.std_logic_textio.all;
use ieee.numeric_std.all;

entity sqrt8_tb is
end sqrt8_tb;

architecture behav of sqrt8_tb is
    signal p : std_logic_vector(7 downto 0);
    signal u : std_logic_vector(3 downto 0);
    procedure print(
        p : std_logic_vector(7 downto 0);
        u : std_logic_vector(3 downto 0)
    ) is
        variable my_line : line;
        alias swrite is write [line, string, side, width];
    begin
        write(my_line, p);
        swrite(my_line, " = ");
        write(my_line, u);
        writeline(output, my_line);
    end print;
begin
    sqrt8_0: entity work.sqrt8 port map(p, u);
    process
    begin
        for i in 0 to 255 loop
            p <= std_logic_vector(to_unsigned(i, 8));
            wait for 2 ns;
            print(p, u);
        end loop;
        wait;
    end process;
end architecture behav;
