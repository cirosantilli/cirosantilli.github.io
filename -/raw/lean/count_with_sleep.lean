partial def main (n : Nat := 1) : IO Unit := do
  IO.println n
  IO.sleep 1000
  main (n + 1)
