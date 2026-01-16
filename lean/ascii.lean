variable (P Q R: Prop)

example : (1 ≤ 2) = (1 <= 2) := rfl
example : (1 ≤ 2) = (LE.le 1 2) := rfl

example : (1 ≥ 2) = (1 >= 2) := rfl
example : (1 ≥ 2) = (GE.ge 1 2) := rfl

example : (1 ≠ 2) = (Ne 1 2) := rfl
example : (1 ≠ 2) = (Not (1 = 2)) := rfl
-- native.lean:11:23: error: expected token
--example : (1 ≠ 2) = (1 ~= 2) := rfl

example : (¬P) = (Not P) := rfl
example : (P ∧ Q) = (P /\ Q) := rfl
example : (P ∧ Q) = (And P Q) := rfl
example : (P ∨ Q) = (P \/ Q) := rfl
example : (P ∨ Q) = (Or P Q) := rfl
example : (P → Q) = (P -> Q) := rfl
example : (P ↔ Q) = (P <-> Q) := rfl
example : (P ↔ Q) = (Iff P Q) := rfl

example : (Nat × Nat) = (Prod Nat Nat) := rfl

example : (∀ (x : Nat), x = 1) = (forall (x : Nat), x = 1) := rfl
example : (∃ (x : Nat), x = 1) = (exists (x : Nat), x = 1) := rfl
example : (forall {x : Nat}, x = 1) = (forall (x : Nat), x = 1) := rfl
example : (forall {x : Nat}, x = 1) = (forall ⦃x : Nat⦄, x = 1) := rfl

def inc : Int -> Int := λ (i: Int) ↦ i + 1
def incAscii : Int -> Int := fun (i: Int) => i + 1
example : inc = incAscii := rfl
example : inc (1) = 2 := rfl
example : incAscii (1) = 2 := rfl

-- Unknown identifier
--#check ℕ
--#check ℤ
