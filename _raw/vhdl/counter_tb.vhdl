library ieee;
use ieee.std_logic_1164.all;
library std;
use std.textio.all;

use work.common.all;

entity counter_tb is
end counter_tb;

architecture behav of counter_tb is
    constant width : natural := 2;

    signal rst, load : std_logic := '0';
    signal clk : std_logic := '0';
    signal data : std_logic_vector(width-1 downto 0);
    signal count : std_logic_vector(width-1 downto 0);

    type io_t is record
        load : std_logic;
        data : std_logic_vector(width-1 downto 0);
        count : std_logic_vector(width-1 downto 0);
    end record;
    type ios_t is array (natural range <>) of io_t;
    constant ios : ios_t := (
        ('1', "00", "00"),
        ('0', "UU", "01"),
        ('0', "UU", "10"),
        ('0', "UU", "11"),

        ('1', "10", "10"),
        ('0', "UU", "11"),
        ('0', "UU", "00"),
        ('0', "UU", "01")
    );
begin
    counter_0: entity work.counter port map (rst, clk, load, data, count);

    process
    begin
        for i in ios'range loop
            load <= ios(i).load;
            data <= ios(i).data;
            wait until falling_edge(clk);
            assert count = ios(i).count;
        end loop;
        wait;
    end process;

    process
    begin
        for i in 1 to 2 * ios'length loop
            wait for common_clk_period / 2;
            clk <= not clk;
        end loop;
        wait;
    end process;

end behav;
