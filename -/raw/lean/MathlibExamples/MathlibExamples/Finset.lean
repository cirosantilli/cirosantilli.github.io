import Mathlib.Data.Finset.Basic -- Finset
import Mathlib.Algebra.BigOperators.Group.Finset.Basic -- ∑, ∏

example : (∑ x ∈ ({1, 2, 4} : Finset ℕ), x) = 7 := by decide
example : (∏ x ∈ ({1, 2, 4} : Finset ℕ), x) = 8 := by decide
