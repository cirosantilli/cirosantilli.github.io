use std.textio.all;

entity hello_world_tb is
end hello_world_tb;

architecture behav of hello_world_tb is
begin
   process
      variable l : line;
   begin
      write (l, String'("hello world"));
      writeline (output, l);
      wait;
   end process;
end behav;
