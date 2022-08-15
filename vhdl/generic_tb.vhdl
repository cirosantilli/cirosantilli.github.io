-- Similar to C++ templates.
-- The most common use case is to generalize bus widths,
-- and also types in VHDL 2008 http://stackoverflow.com/questions/10890551/is-it-possible-to-write-type-generic-entities-in-vhdl

entity generic_x is
    generic (
        -- Default value.;
        i : integer := 0
    );
    port (o : out integer);
end generic_x;

architecture rtl of generic_x is
begin
    o <= i;
end rtl;

--

entity generic_tb is
end generic_tb;

architecture behav of generic_tb is
    signal s0 : integer;
    signal s1 : integer;
begin
    generic_x_0: entity work.generic_x port map (s0);
    generic_x_1: entity work.generic_x generic map ( i => 1 ) port map (s1);
    process is
    begin
        wait for 1 ns;
        assert s0 = 0;
        assert s1 = 1;
        wait;
    end process;
end behav;
