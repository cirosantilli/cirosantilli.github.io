def incSuperExplicit : Int -> Int := fun (i: Int) => i + 1
example : incSuperExplicit (1) = 2 := rfl

def incSuperExplicitUnicode : Int -> Int := λ (i: Int) ↦ i + 1
example : incSuperExplicitUnicode (1) = 2 := rfl

def incNatSuperExplicit : Nat -> Nat := fun (i: Nat) => i + 1
example : incNatSuperExplicit (1) = 2 := rfl

def incExplicit (i : Int) : Int := i + 1
example : incExplicit (1) = 2 := rfl
example : incExplicit 1 = 2 := rfl

def incImplicit i := i + 1
example : incImplicit (1) = 2 := rfl

def incEvenOddIfElse (n : Int) : Int :=
  if n % 2 == 0 then
    n + 1
  else
    n + 3
example : incEvenOddIfElse (1) = 4 := rfl
example : incEvenOddIfElse (2) = 3 := rfl

def incEvenOddPipe (n : Int) : Int :=
  match n % 2 == 0 with
  | true  => n + 1
  | false => n + 3
example : incEvenOddPipe (1) = 4 := rfl
example : incEvenOddPipe (2) = 3 := rfl

def add (x y : Nat) := x + y
example : add 1 2 = 3 := rfl
