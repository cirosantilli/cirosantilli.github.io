/-
This file was edited by Aristotle.

Lean version: leanprover/lean4:v4.24.0
Mathlib version: f897ebcf72cd16f89ab4577d0c826cd14afaafc7
This project request had uuid: 5aacb0bd-ce84-4fba-a545-6765556d493a

The following was proved by Aristotle:

- theorem p1_equiv (n : Nat) : p1def n = p1sol n
-/

def p1def : Nat -> Nat
  | 0       => 0
  | n + 1   =>
      let s := p1def n
      if n % 3 = 0 ∨ n % 5 = 0 then s + n else s

def sumOfMultiples (m n : Nat) : Nat :=
  let k := n / m
  (m * k * (k + 1)) / 2

def p1sol (n : Nat) : Nat :=
  let n' := n - 1
  sumOfMultiples 3 n' + sumOfMultiples 5 n' - sumOfMultiples 15 n'

example : p1sol 10 = 23 := rfl

theorem p1_10 : p1sol 10 = 23 := by native_decide

theorem p1 : p1sol 1000 = 233168 := by native_decide

theorem p1_equiv (n : Nat) : p1def n = p1sol n := by
  revert n;
  unfold p1def p1sol;
  -- By definition of p1def, we can rewrite the left-hand side as the sum of the multiples of 3 and 5 up to n-1, minus the sum of the multiples of 15 up to n-1.
  have h_p1def : ∀ n, p1def n = ∑ m ∈ Finset.range n, if m % 3 = 0 ∨ m % 5 = 0 then m else 0 := by
    intro n;
    induction n <;> simp +arith +decide [ *, Finset.sum_range_succ ];
    rename_i n ih;
    rw [ ← ih, show p1def ( n + 1 ) = p1def n + if n % 3 = 0 ∨ n % 5 = 0 then n else 0 from ?_ ];
    -- By definition of p1def, we have p1def (n + 1) = p1def n + if n % 3 = 0 ∨ n % 5 = 0 then n else 0.
    rw [show p1def (n + 1) = if n % 3 = 0 ∨ n % 5 = 0 then p1def n + n else p1def n from rfl];
    split_ifs <;> ring;
  -- By definition of sumOfMultiples, we can rewrite the right-hand side as the sum of the multiples of 3 and 5 up to n-1, minus the sum of the multiples of 15 up to n-1.
  have h_sumOfMultiples : ∀ n, sumOfMultiples 3 n + sumOfMultiples 5 n - sumOfMultiples 15 n = ∑ m ∈ Finset.range (n + 1), if m % 3 = 0 ∨ m % 5 = 0 then m else 0 := by
    intro n; rw [ Nat.sub_eq_of_eq_add ] ; induction n <;> simp_all +decide [ Finset.sum_range_succ ] ; ring;
    unfold sumOfMultiples at *; simp_all +decide [ Nat.add_comm 1, Nat.add_div ] ;
    grind;
  rintro ( _ | n ) <;> simp_all +decide [ Finset.sum_range_succ ];
  split_ifs <;> ring

def main : IO Unit := do
  IO.println (p1sol 1000)
