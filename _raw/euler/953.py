'''
By GPT-5.1. Runtime: 1.22s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

import math
from typing import List, Tuple

MOD: int = 10**9 + 7
PRIME_LIMIT: int = 1 << 24

def sieve(limit: int) -> Tuple[bytearray, List[int]]:
    is_prime: bytearray = bytearray(b"\x01") * (limit + 1)
    is_prime[0:2] = b"\x00\x00"
    upper: int = int(limit**0.5)
    for p in range(2, upper + 1):
        if is_prime[p]:
            step: int = p
            start: int = p * p
            is_prime[start:limit+1:step] = b"\x00" * (((limit - start) // step) + 1)
    primes: List[int] = [i for i in range(2, limit + 1) if is_prime[i]]
    return is_prime, primes

is_prime, primes = sieve(PRIME_LIMIT)
INV6: int = pow(6, MOD - 2, MOD)

def sum_sq(T: int) -> int:
    T_mod: int = T % MOD
    return (T_mod * (T_mod + 1) % MOD * (2 * T_mod + 1) % MOD) * INV6 % MOD

def contribution_for_m(m: int, N: int) -> int:
    if m > N:
        return 0
    T: int = math.isqrt(N // m)
    if T == 0:
        return 0
    return (m % MOD) * sum_sq(T) % MOD

def compute_S(N: int) -> int:
    ans: int = contribution_for_m(1, N) % MOD
    sqrtN: int = math.isqrt(N)
    prefix_end: int = 0
    for i, p in enumerate(primes):
        if p > sqrtN:
            break
        prefix_end = i + 1
    stack: List[Tuple[int, int, int, int]] = []
    for idx in range(prefix_end):
        p: int = primes[idx]
        if p * p > N:
            break
        stack.append((idx + 1, p, p, p))
    primes_local: List[int] = primes
    is_prime_local: bytearray = is_prime
    PRIME_LIMIT_LOCAL: int = PRIME_LIMIT
    N_local: int = N
    while stack:
        next_idx, prod, xor_val, last_p = stack.pop()
        cand: int = xor_val
        if cand > last_p and cand <= PRIME_LIMIT_LOCAL and is_prime_local[cand] and prod * cand <= N_local:
            m: int = prod * cand
            ans = (ans + contribution_for_m(m, N_local)) % MOD
        N_div_prod: int = N_local // prod
        for j in range(next_idx, prefix_end):
            q: int = primes_local[j]
            if q * q > N_div_prod:
                break
            new_prod: int = prod * q
            new_xor: int = xor_val ^ q
            stack.append((j + 1, new_prod, new_xor, q))
    return ans % MOD

if __name__ == "__main__":
    assert compute_S(10) == 14
    assert compute_S(100) == 455
    print(compute_S(10**14) % MOD)
