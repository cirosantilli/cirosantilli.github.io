#!/usr/bin/env python

'''
By GPT-5. Runtime: 0m25.085s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from math import isqrt, gcd

def sieve_primes(limit: int) -> list[int]:
    sieve = bytearray(b"\x01") * (limit + 1)
    sieve[0:2] = b"\x00\x00"
    sq = isqrt(limit)
    for p in range(2, sq + 1):
        if sieve[p]:
            step = p
            start = p * p
            sieve[start:limit+1:step] = b"\x00" * ((limit - start) // step + 1)
    return [i for i in range(2, limit + 1) if sieve[i]]

PRIMES = sieve_primes(10**6)

def factor(n: int) -> list[tuple[int, int]]:
    res: list[tuple[int, int]] = []
    tmp = n
    for p in PRIMES:
        if p * p > tmp:
            break
        if tmp % p == 0:
            e = 1
            tmp //= p
            while tmp % p == 0:
                tmp //= p
                e += 1
            res.append((p, e))
        if tmp == 1:
            break
    if tmp > 1:
        res.append((tmp, 1))
    return res

def divisors_from_factors(factors: list[tuple[int, int]]) -> list[int]:
    divs = [1]
    for p, e in factors:
        base = divs
        new_divs: list[int] = []
        pe = 1
        for _ in range(e + 1):
            for d in base:
                new_divs.append(d * pe)
            pe *= p
        divs = new_divs
    return divs

def gen_us_from_z_factor(z_factors: list[tuple[int, int]]) -> list[int]:
    if not z_factors:
        return [1]
    bases = [p for p, _ in z_factors]
    limits = [(2 * e) // 3 for _, e in z_factors]
    us: list[int] = []
    def backtrack(i: int, cur: int) -> None:
        if i == len(bases):
            us.append(cur)
            return
        p = bases[i]
        val = 1
        max_e = limits[i]
        for _ in range(max_e + 1):
            backtrack(i + 1, cur * val)
            val *= p
    backtrack(0, 1)
    return us

def integer_cuberoot_floor(n: int) -> int:
    if n <= 0:
        return 0
    x = int(round(n ** (1.0 / 3.0)))
    while (x + 1) ** 3 <= n:
        x += 1
    while x > 0 and x ** 3 > n:
        x -= 1
    return x

def count_triangles(N: int) -> int:
    total = 0
    max_z = N // 3
    for z in range(1, max_z + 1):
        z_factors = factor(z)
        z2 = z * z
        u_candidates = gen_us_from_z_factor(z_factors)
        for u in u_candidates:
            u3 = u * u * u
            if z2 % u3 != 0:
                continue
            w = z2 // u3
            if w == 0:
                continue
            v_max_cubed = (N * N) // w
            if v_max_cubed == 0:
                continue
            v_max = integer_cuberoot_floor(v_max_cubed)
            if v_max < u:
                continue
            for v in range(u, v_max + 1):
                if gcd(u, v) != 1:
                    continue
                T = v * w
                T_factors = factor(T)
                divisors = divisors_from_factors(T_factors)
                uv_sum = u + v
                for p in divisors:
                    q = T // p
                    if p <= q:
                        continue
                    if (p ^ q) & 1:
                        continue
                    g = (p + q) // 2
                    m = (p - q) // 2
                    if m <= 0 or g <= m:
                        continue
                    a = g * u
                    b = g * v
                    c = m * uv_sum
                    P = a + b + c
                    if P > N:
                        continue
                    if not (a <= b <= c):
                        continue
                    if a + b <= c:
                        continue
                    total += 1
    return total

def brute_force(N: int) -> int:
    cnt = 0
    for a in range(1, N // 3 + 1):
        for b in range(a, (N - a) // 2 + 1):
            max_c = min(a + b - 1, N - a - b)
            for c in range(b, max_c + 1):
                num = (a * a * a) * (a + b + c) * (a + b - c)
                den = b * (a + b) * (a + b)
                if num % den != 0:
                    continue
                z2 = num // den
                z = isqrt(z2)
                if z * z == z2:
                    cnt += 1
    return cnt

if __name__ == "__main__":
    for test_N in (60, 80, 100, 150, 200):
        assert count_triangles(test_N) == brute_force(test_N)
    print(count_triangles(10**6))

