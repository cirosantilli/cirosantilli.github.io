-- LIke a procedure, but:
-- - has a return value
-- - cannot have wait

entity function_tb is
    function entity_is(x : integer)
        return integer is
    begin
        return x + 1;
    end entity_is;
end function_tb;

architecture behav of function_tb is
    signal s0 : integer;

    function inc(x : integer)
        return integer is
    begin
        return x + 1;
    end inc;

    function wait_test(x : integer)
        return integer is
    begin
        -- Not allowed in function.
        --wait for 1 ns;
    end wait_test;

    -- No parenthesis on definition.
    function no_args
        return integer is
    begin
        return 1;
    end no_args;

    -- # pure function

        -- TODO: how to make impure functions?

        -- Pure functions have some language defined properties,
        -- e.g. only pure functions can resolve types.

begin
    process is
        function proc_is(x : integer)
            return integer is
        begin
            return x + 1;
        end proc_is;
    begin
        assert inc(1) = 2;
        -- Function definitions can go inside `process is` as well.
        assert proc_is(1) = 2;
        -- And `entity is`.
        assert entity_is(1) = 2;
        -- No parenthesis on call.
        assert no_args = 1;
        wait;
    end process;
end behav;
