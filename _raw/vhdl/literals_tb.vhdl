-- VHDL 2008 15. Lexical elements - Several sections.

library ieee;
use ieee.std_logic_1164.all;

entity literals_tb is
end literals_tb;

architecture behav of literals_tb is
    signal my_integer : integer;
begin
    process
        -- Character.

            constant my_character_a  : character := 'a';
            -- Non printable characters have predefined names.
            constant my_character_lf : character := lf;

        -- String.

            constant my_string_abcd    : string := "abcd";
            -- - split long strings
            -- - mix in non-printable characters
            constant my_string_abcd_2  : string := "ab" & "cd";
            constant my_string_abcd_lf : string := "ab" & lf;

        -- Bit string literals.

            constant std_logic_vector_8   : std_logic_vector(7 downto 0) := X"1A";
            constant std_logic_vector_8_2 : std_logic_vector(7 downto 0) := B"00011010";

        -- integer

            constant my_integer  : integer := 1;

        -- real

            constant my_real : real := 1.0;

    begin
        -- Numeric

            --my_integer <= 1;
            --assert (my_integer = 1);

            -- Single underscores can be used as you please inside numbers.
            assert 1_1 = 11;

            -- Exponent integer.
            assert 1E1 = 10;

            -- Based literal.
            assert 2#10# = 2;
            assert 3#10# = 3;
            assert 16#10# = 16;

        -- String

            assert string'("abcd") = string'("ab" & "cd");

        -- Bit-string literal.

            assert std_logic_vector'(B"1010") = std_logic_vector'(X"A");

        -- Boolean. TODO what are TRUE and FALSE? Not reserved.

            assert true;
            assert not false;

        wait;
    end process;
end behav;
