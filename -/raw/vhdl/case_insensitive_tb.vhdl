-- Everything in VHDL is case insensitive, except for string literals / characters.
--
-- There are different style guides, but I just write everything lowercase
-- as it is faster to write, and does not carry any information.
--
-- I only make exceptions for:
--
-- - based literals, or else the base is too invisible compared to the large digits: `X#123#`

enTity CASE_INSENSITIVE_TB is
end case_insensitive_tb;

ArchiteCture behAV oF caSe_insensitive_tb is
bEgin
    Process is
        CONStant a : integer := 1;
    begin
        AsSeRt A = 1;
        wait;
    end process;
eNd Behav;
