-- Simulators update a simulation step only up to a certain number of times.
-- This would lead to an infinite loop, so any simulators should give an error.
-- ghdl uses he --stop-delta option to determine how many steps should be done.

library IEEE;
use IEEE.std_logic_1164.all;

entity stop_delta_tb is
end stop_delta_tb;

architecture behav of stop_delta_tb is
    signal s0 : std_logic := '0';
begin
    -- s0 <= not s0;
end behav;
