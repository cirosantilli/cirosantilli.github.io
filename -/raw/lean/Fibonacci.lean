def fib : Nat -> Nat
  | 0       => 1
  | 1       => 2
  | n + 2   => fib (n) + fib (n + 1)

-- “Increasing” = monotone on Nat
def Increasing (f : Nat → Nat) : Prop :=
  ∀ ⦃a b : Nat⦄, a ≤ b → f a ≤ f b
--
---- Transitivity of ≤ (proved from the inductive definition of Nat.le)
--theorem le_trans' {a b c : Nat} (hab : a ≤ b) (hbc : b ≤ c) : a ≤ c := by
--  induction hbc with
--  | refl =>
--      exact hab
--  | step c hbc ih =>
--      exact Nat.le.step ih
--
---- A helper: a ≤ a + b (by induction on b)
--theorem le_add_right' (a b : Nat) : a ≤ a + b := by
--  induction b with
--  | zero =>
--      simp
--  | succ b ih =>
--      -- ih : a ≤ a + b
--      -- want a ≤ a + (b+1) = succ (a+b)
--      simpa [Nat.add_succ] using Nat.le.step ih
--
---- Key “one-step” monotonicity: fib n ≤ fib (n+1)
--theorem fib_le_succ : ∀ n : Nat, fib n ≤ fib (n + 1)
--  | 0 => by decide
--  | 1 => by decide
--  | n + 2 => by
--      -- Let X = fib n + fib (n+1) = fib (n+2).
--      -- We want X ≤ fib (n+1) + X = fib (n+3).
--      have h : fib n + fib (n + 1) ≤ (fib n + fib (n + 1)) + fib (n + 1) :=
--        le_add_right' (fib n + fib (n + 1)) (fib (n + 1))
--
--      have h' :
--          fib n + fib (n + 1) ≤ fib (n + 1) + (fib n + fib (n + 1)) := by
--        simpa [Nat.add_comm, Nat.add_left_comm, Nat.add_assoc] using h
--
--      simpa [fib, Nat.add_comm, Nat.add_left_comm, Nat.add_assoc] using h'
--
---- Full monotonicity: a ≤ b → fib a ≤ fib b
--theorem fib_increasing : Increasing fib := by
--  intro a b hab
--  induction hab with
--  | refl =>
--      exact Nat.le.refl _
--  | step b hab ih =>
--      -- ih : fib a ≤ fib b, and fib b ≤ fib (b+1)
--      exact le_trans' ih (fib_le_succ b)
--
