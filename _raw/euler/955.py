#!/usr/bin/env python

'''
By GPT-5.1. Runtime: 0m0.751s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from math import isqrt
from random import randrange
from typing import Dict, List, Tuple

def is_prime(n: int) -> bool:
    if n < 2:
        return False
    small_primes = [2,3,5,7,11,13,17,19,23,29]
    for p in small_primes:
        if n % p == 0:
            return n == p
    d = n - 1
    s = 0
    while d % 2 == 0:
        s += 1
        d //= 2
    for a in [2,325,9375,28178,450775,9780504,1795265022]:
        if a % n == 0:
            continue
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        composite = True
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                composite = False
                break
        if composite:
            return False
    return True

def pollards_rho(n: int) -> int:
    if n % 2 == 0:
        return 2
    if n % 3 == 0:
        return 3
    while True:
        x = randrange(2, n - 1)
        y = x
        c = randrange(1, n - 1)
        d = 1
        while d == 1:
            x = (x * x + c) % n
            y = (y * y + c) % n
            y = (y * y + c) % n
            d = gcd(abs(x - y), n)
        if d != n:
            return d


def gcd(a: int, b: int) -> int:
    while b:
        a, b = b, a % b
    return a


def factor(n: int, out: Dict[int, int]) -> None:
    if n == 1:
        return
    if is_prime(n):
        out[n] = out.get(n, 0) + 1
        return
    d = pollards_rho(n)
    factor(d, out)
    factor(n // d, out)


def all_divisors_from_factors(f: Dict[int, int]) -> List[int]:
    ds = [1]
    for p, e in f.items():
        new_ds = []
        pe = 1
        for _ in range(e):
            pe *= p
            for x in ds:
                new_ds.append(x * pe)
        ds += new_ds
    ds.sort()
    return ds


def divisors(n: int) -> List[int]:
    f: Dict[int, int] = {}
    factor(n, f)
    return all_divisors_from_factors(f)


def is_triangular(t: int) -> bool:
    d = 8 * t + 1
    s = isqrt(d)
    return s * s == d and (s - 1) % 2 == 0


def generate_sequence(limit_n: int) -> List[int]:
    a = [3]
    for n in range(limit_n):
        an = a[n]
        if is_triangular(an):
            a.append(an + 1)
        else:
            a.append(2 * an - a[n - 1] + 1)
    return a


def next_triangle_jump(a_tri: int) -> Tuple[int,int]:
    M = 2 * a_tri
    for x in divisors(M):
        y = M // x
        if (x - y) & 1:
            k = (x - y - 1) // 2
            if k > 0:
                new_a = a_tri + k * (k + 1) // 2
                return k, new_a
    raise RuntimeError("No valid k found.")

def index_of_kth_triangular_in_sequence(kth: int) -> Tuple[int,int]:
    n = 0
    a = 3
    if kth == 1:
        return n, a
    for _ in range(kth - 1):
        step_k, a = next_triangle_jump(a)
        n += step_k
    return n, a

if __name__ == "__main__":
    assert index_of_kth_triangular_in_sequence(10) == (2964, 1439056)
    print(index_of_kth_triangular_in_sequence(70)[0])
