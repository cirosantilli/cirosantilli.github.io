-- write and company: writing to stdout.

library std;
use std.textio.all;
library ieee;
use ieee.std_logic_1164.all;
use ieee.numeric_std.all;
use ieee.std_logic_textio.all; -- hwrite

entity write_tb is
end entity write_tb;

architecture behav of write_tb is
    signal std_logic_vector_32 : std_logic_vector(31 downto 0) := X"00000004";
    signal counter : integer := 1;
begin
    process is
        variable my_line : line;
    begin
        -- # write

            -- Write string to a line variable or to stdout.

            write(output, string'("write output") & lf);

            -- TODO cannot write integer directly to stdout. Why?
            -- cannot resolve overloading for subprogram call
            --write(output, 1);
            write(output, to_string(1) & lf);

            write(my_line, string'("write to variable"));
            writeline(output, my_line);

        -- # writeline

            -- Write line to stdout, and add a newline at the end.

            -- Seems to convert the all newlines to the system specific newlines.

            write(output, string'("hello world"));
            writeline(output, my_line);

        -- # swrite

            -- VHDL 2008.
            -- More practical than write for strings, as it dispenses the type.

            swrite(my_line, "swrite");
            writeline(output, my_line);

            -- TODO nope. Why?
            --swrite(output, "swrite");

        -- How stuff prints under write.

            -- I think `to_string` is called.

            -- Numeric literals.

            swrite(my_line, "1 = ");
            write(my_line, 1);
            writeline(output, my_line);

            swrite(my_line, "1_1 = ");
            write(my_line, 1_1);
            writeline(output, my_line);

            swrite(my_line, "1E1 = ");
            write(my_line, 1E1);
            writeline(output, my_line);

            swrite(my_line, "1.1 = ");
            write(my_line, 1.1);
            writeline(output, my_line);

            -- Write integer as hexadecimal.

                --hwrite(my_line, std_logic_vector(to_unsigned(16,8)));
                -- http://stackoverflow.com/questions/37879954/how-to-write-an-integer-to-stdout-as-hexadecimal-in-vhdl/37885828#37885828

                write(output, string'("hexadecimal") & lf);
                write(output, to_hstring(to_unsigned(16, 32)) & lf);

                hwrite(my_line, std_logic_vector(to_unsigned(16, 32)));
                writeline(output, my_line);

            -- Time.

            swrite(my_line, "1 ns = ");
            write(my_line, 1 ns);
            writeline(output, my_line);

            swrite(my_line, "1 ms = ");
            write(my_line, 1 ms);
            writeline(output, my_line);

        -- # hwrite

            -- Formats std_logic_vector as hex.
            -- VHDL 2008, previously Synopsys extension.

            swrite(my_line, "std_logic_vector_32 = ");
            hwrite(my_line, std_logic_vector_32);
            writeline(output, my_line);

        wait;
    end process;
end architecture behav;
