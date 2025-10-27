#!/usr/bin/env python

# Runtime: 1m41.925s on Python 3.11.11, Ubuntu 25.04, Lenovo ThinkPad P51.
# Output: 0.0003452201133

from decimal import Decimal, getcontext

def compute_F_farey(N):
    # high precision to ensure correct rounding to 13 decimals
    getcontext().prec = 50
    a, b, c, d = 0, 1, 1, N
    total = Decimal(0)
    while c <= N:
        # each Farey neighbor pair (a/b, c/d) contributes 1 / (2*b*d^2)
        total += Decimal(1) / (Decimal(2) * Decimal(b) * Decimal(d) * Decimal(d))
        k = (N + b) // d
        e = k * c - a
        f = k * d - b
        a, b, c, d = c, d, e, f
    return total

if __name__ == "__main__":
    N = 10_000
    value = compute_F_farey(N)
    # round to 13 digits after decimal point
    result = value.quantize(Decimal('0.0000000000001'))
    print(result)
