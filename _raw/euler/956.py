#!/usr/bin/env python

'''
By GPT-5.1. Runtime: 0m0.284s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from typing import List

MOD = 999_999_001
ROOT = 17

def primes_up_to(N: int) -> List[int]:
    is_prime = [True] * (N + 1)
    is_prime[0] = False
    is_prime[1] = False
    primes: List[int] = []
    for i in range(2, N + 1):
        if is_prime[i]:
            primes.append(i)
            j = i * i
            step = i
            while j <= N:
                is_prime[j] = False
                j += step
    return primes

def exponents_for_star(N: int, primes: List[int]) -> List[int]:
    exps: List[int] = []
    for p in primes:
        vp_in_k = [0] * (N + 1)
        for k in range(1, N + 1):
            x = k
            c = 0
            while x % p == 0:
                x //= p
                c += 1
            vp_in_k[k] = c
        fact_vp = [0] * (N + 1)
        for k in range(1, N + 1):
            fact_vp[k] = fact_vp[k - 1] + vp_in_k[k]
        E = 0
        for k in range(1, N + 1):
            E += (N + 1 - k) * fact_vp[k]
        exps.append(E)
    return exps

def D_star_mod(N: int) -> int:
    primes = primes_up_to(N)
    exps = exponents_for_star(N, primes)
    m = N
    omega = pow(ROOT, (MOD - 1) // m, MOD)
    inv_m = pow(m, MOD - 2, MOD)
    ans = 0
    w = 1
    for _ in range(m):
        prod = 1
        for p, E in zip(primes, exps):
            r = (p * w) % MOD
            if r == 1:
                term = (E + 1) % MOD
            else:
                num = (pow(r, E + 1, MOD) - 1) % MOD
                den = (r - 1) % MOD
                den_inv = pow(den, MOD - 2, MOD)
                term = (num * den_inv) % MOD
            prod = (prod * term) % MOD
        ans = (ans + prod) % MOD
        w = (w * omega) % MOD
    return (ans * inv_m) % MOD

if __name__ == "__main__":
    assert D_star_mod(3) == 21 % MOD
    assert D_star_mod(6) == 6368195719791280 % MOD
    print(D_star_mod(1000))
