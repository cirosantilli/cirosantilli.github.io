-- This example shows that it is possible to prove things about humongous finsets
-- that don't fit into the universe, they don't materialize.

import Mathlib.Data.Set.Finite.Basic
import Mathlib.Data.Finset.Range
import Mathlib.Data.Nat.Basic

noncomputable section

def bound : ℕ := (10 : ℕ) ^ ( 1000000000 ^ 100000000 ^ 1000000000 )

def evensBelow : Set ℕ := {n | n < bound ∧ n % 2 = 0}

-- Prove finiteness by showing it's a subset of (Finset.range bound : Set ℕ).
lemma evensBelow_finite : (evensBelow).Finite := by
  refine (Finset.range bound).finite_toSet.subset ?_
  intro n hn
  -- goal: n ∈ (↑(Finset.range bound) : Set ℕ)
  -- hn : n < bound ∧ Nat.Even n
  show n ∈ (↑(Finset.range bound) : Set ℕ)
  -- membership in range is "n < bound"
  simpa using (Finset.mem_range.mpr hn.1)

-- Convert Set → Finset using the finiteness proof
def evensBelow_finset : Finset ℕ :=
  (evensBelow_finite).toFinset


import Mathlib.Data.Finset.Basic -- Finset
import Mathlib.Algebra.BigOperators.Group.Finset.Basic -- ∑, ∏

example : (∑ x ∈ ({1, 2, 4} : Finset ℕ), x) = 7 := by decide
example : (∏ x ∈ ({1, 2, 4} : Finset ℕ), x) = 8 := by decide
