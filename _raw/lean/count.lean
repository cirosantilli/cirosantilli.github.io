partial def main (n : Nat := 1) : IO Unit := do
  IO.println n
  main (n + 1)
