def main : IO Unit := do
  for i in [1:11] do   -- range is inclusive of 1, exclusive of 11
    IO.println i
