-- http://www.ics.uci.edu/~jmoorkan/vhdlref/assert.html
--
-- Syntax: assert <condition> [report <msg> [severity <severity>]]
--
-- Severity is one of: note, warning, error or failure
--
-- Default severity: error.
--
-- It is up to your simulator to decide what to do with asserts.
--
-- ghdl has --assert-level to decide which is the minimum level that aborts
-- the simulation and returns 1 exit status.

entity assert_tb is
end assert_tb;

architecture behav of assert_tb is
begin
end behav;
