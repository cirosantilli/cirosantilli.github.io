import Mathlib.Data.Set.Basic
open Set

def hello := "world"

variable {U : Type}
variable (A B C : Set U)
variable (x : U)

#check x ∈ A
#check Set.mem x A
#check A ∪ B
#check B \ C
#check C ∩ A
#check Cᶜ
#check ∅ ⊆ A
#check B ⊆ univ
