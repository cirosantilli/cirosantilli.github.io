-- VHDL 2008 16.3 Package STANDARD
-- TODO: package is always available.
-- Contains the definition of the types of most / all literals.

library std;
use std.textio.all;

entity standard_package_tb is
end standard_package_tb;

architecture behav of standard_package_tb is
    alias swrite is write [line, string, side, width];
begin
    process is
        -- Enumeration type.
        variable my_char : character := 'a';
        variable my_line : line;
    begin
        -- # integer

            -- Integer with implementation defined range,
            -- guaranteed at least 4 bytes.

            swrite(my_line, "integer'high = ");
            write(my_line, integer'high);
            writeline(output, my_line);

            swrite(my_line, "integer'low = ");
            write(my_line, integer'low);
            writeline(output, my_line);
        wait;
    end process;
end behav;
