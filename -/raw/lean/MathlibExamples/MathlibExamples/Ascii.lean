import Mathlib.Algebra.BigOperators.Group.Finset.Basic -- ∑, ∏
import Mathlib.Data.Finset.Basic -- Finset
import Mathlib.Data.Int.Notation -- ℤ
import Mathlib.Data.Nat.Notation -- ℕ
import Mathlib.Data.Rat.Init -- ℚ
import Mathlib.Data.Real.Basic -- ℝ
import Mathlib.Order.Notation -- ⊥

-- Mathlib.Data
example : ℕ = Nat := rfl
example : ℤ = Int := rfl
example : ℚ = Rat := rfl
example : ℝ = Real := rfl

-- Mathlib.Order.Notation
example : (⊥ : Nat) = 0 := rfl

-- Mathlib.Algebra.BigOperators.Group.Finset.Basic
def myFinset := ({1, 2, 4} : Finset ℕ)
example : (∑ x ∈ myFinset, x) = 7 := by decide
example : (∑ x ∈ myFinset, x) =
          (Finset.sum myFinset (fun x => x)) := by rfl
example : (∏ x ∈ myFinset, x) = 8 := by decide
example : (∏ x ∈ myFinset, x) =
          (Finset.prod myFinset (fun x => x)) := by rfl
