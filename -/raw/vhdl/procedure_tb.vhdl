library std;
use std.textio.all;

entity procedure_tb is
end procedure_tb;

architecture behav of procedure_tb is

    signal s0 : integer;

    procedure print_integer (
        i : in integer
    ) is
        variable my_line : line;
    begin
        write(my_line, i);
        writeline(output, my_line);
    end print_integer;

    -- Modify a signal.
    procedure add_to_s0 (
        i1 : in integer;
        i2 : in integer;
        signal s0 : out integer
    ) is
    begin
        s0 <= i1 + i2;
        wait for 1 ns;
    end add_to_s0;

    -- Procedures can be overloaded.

        procedure overload (
            i1 : in bit;
            signal s0 : out integer
        ) is
        begin
            s0 <= 0;
            wait for 1 ns;
        end overload;

        procedure overload (
            i1 : in integer;
            signal s0 : out integer
        ) is
        begin
            s0 <= 1;
            wait for 1 ns;
        end overload;

    -- No args.

        -- Possible to define, but can it do anything useful?
        procedure no_args
        is
        begin
            --s0 <= 1;
            wait for 1 ns;
        end no_args;


begin
    process is
    begin
        print_integer(1);
        print_integer(2);

        add_to_s0(1, 2, s0);
        assert s0 = 3;

        -- Overloading

            overload(bit'('1'), s0);
            assert s0 = 0;

            overload(integer'(1), s0);
            assert s0 = 1;

        wait;
    end process;
end behav;
