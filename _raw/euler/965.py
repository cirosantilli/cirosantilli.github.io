#!/usr/bin/env python

# Runtime: 1m41.925s on Python 3.11.11, Ubuntu 25.04, Lenovo ThinkPad P51.
# Output: 0.0003452201133

from decimal import Decimal, getcontext

def F(N: int) -> Decimal:
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
    assert F(1) == Decimal('0.5')
    assert F(4) == Decimal('0.25')
    assert str(F(10).quantize(Decimal('0.0000000000001'))) == '0.1319444444444'
    print(F(10*4).quantize(Decimal('0.0000000000001')))
