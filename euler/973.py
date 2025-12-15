#!/usr/bin/env python

# By GPT-5.2. Runtime: 0m0.417s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.

MOD = 10**9 + 7
INV2 = (MOD + 1) // 2

def S_k_value(N: int, k: int, mod: int = MOD) -> int:
    if k == 0:
        if N == 0:
            return 1
        return (-pow(mod - 2, N - 1, mod)) % mod
    B = 1 << k
    period = B << 1
    S = [0] * (N + 1)
    P = [0] * (N + 1)
    S[0] = 1
    P[0] = 1
    PP = P
    SS = S
    m = mod
    per_mask = period - 1
    for n in range(1, N + 1):
        val = 0
        s = 1
        while s <= n:
            p = s & per_mask
            if p < B:
                sign = 1
                e = s + (B - p) - 1
            else:
                sign = -1
                e = s + (period - p) - 1
            if e > n:
                e = n
            t_lo = n - e
            t_hi = n - s
            if t_lo == 0:
                sum_range = PP[t_hi]
            else:
                sum_range = PP[t_hi] - PP[t_lo - 1]
            val += sign * sum_range
            s = e + 1
        SS[n] = val % m
        PP[n] = (PP[n - 1] + SS[n]) % m
    return SS[N]

def X(n: int, mod: int = MOD) -> int:
    if n <= 0:
        return 0
    P = pow(2, n - 1, mod)
    total = 0
    for k in range(14):
        Sk = S_k_value(n, k, mod)
        Ak = (P - Sk) * INV2 % mod
        total = (total + pow(2, k, mod) * Ak) % mod
    total = (total - (n & 1)) % mod
    return total

if __name__ == "__main__":
    assert X(2) == 2
    assert X(4) == 14
    assert X(10) == 1418
    print(X(10_000))

