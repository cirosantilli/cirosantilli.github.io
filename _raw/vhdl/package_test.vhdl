package package_test is
    constant package_test_constant : integer := 1;
    function package_test_funcion(x : integer) return integer;
end;

package body package_test is
    function package_test_funcion(x : integer)
        return integer is
    begin
        return x + 1;
    end package_test_funcion;
end package body;
