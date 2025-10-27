#!/usr/bin/env python

# Runtime: 0m0.186s on Python 3.11.11, Ubuntu 25.04, Lenovo ThinkPad P51.
# Output: 4.7126135532e-29

from functools import lru_cache
from fractions import Fraction
import math
from decimal import Decimal, getcontext

# --- Partition utilities -----------------------------------------------------

def hook_partition(n, m):
    """Return the hook partition (n-m, 1^m)."""
    return (n - m,) + (1,) * m if m > 0 else (n,)

@lru_cache(None)
def count_removal_paths(start, target):
    """Count number of ways to remove boxes from partition 'start'
       to reach 'target' by successively removing corner boxes."""
    if start == target:
        return 1
    if sum(start) < sum(target):
        return 0

    total = 0
    l = len(start)
    for r in range(l):
        # find corners
        if r == l - 1 or start[r + 1] < start[r]:
            new = list(start)
            new[r] -= 1
            if new[r] == 0:
                new.pop(r)
            new = tuple(new)

            # ensure containment (new >= target)
            ok = True
            for i in range(len(new)):
                if i < len(target) and new[i] < target[i]:
                    ok = False
                    break
            if len(new) < len(target):
                ok = False
            if not ok:
                continue

            total += count_removal_paths(new, target)
    return total

def multiplicity(lambda_part, i):
    """Multiplicity m_{λ,i}: number of ways to reduce λ to (i)."""
    return count_removal_paths(lambda_part, (i,))

def dim_hook(n, m):
    """Dimension of hook partition (n-m, 1^m) = C(n-1, m)."""
    from math import comb
    return comb(n - 1, m)

# --- Probability computation -------------------------------------------------

def compute_P(k):
    """Compute P(k) as described in Project Euler 964."""
    n = k * (k - 1) // 2 + 1
    nfact = math.factorial(n)
    total = Fraction(0, 1)

    for m in range(0, n):
        lam = hook_partition(n, m)
        prod = 1
        for i in range(1, k + 1):
            mi = multiplicity(lam, i)
            prod *= mi
            if prod == 0:
                break

        d = dim_hook(n, m)
        term = Fraction(((-1) ** m) * prod, d ** (k - 1))
        total += term

    P = total / nfact
    return P

# --- Main --------------------------------------------------------------------

P_frac = compute_P(7)

# Format in scientific notation (10 digits after decimal)
getcontext().prec = 60
dec = Decimal(P_frac.numerator) / Decimal(P_frac.denominator)
exp = dec.adjusted()
mant = dec.scaleb(-exp)
mant_rounded = +mant.quantize(Decimal('1.' + '0' * 10))
sci = f"{mant_rounded}e{exp}"

print("P(7) =", sci)
