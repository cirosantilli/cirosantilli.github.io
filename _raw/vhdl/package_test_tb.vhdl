use work.package_test.all;

entity package_test_tb is
end package_test_tb;

architecture behav of package_test_tb is
begin
    process is
    begin
        assert package_test_funcion(1) = 2;
        assert package_test_constant = 1;
        wait;
    end process;
end behav;
