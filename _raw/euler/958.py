#!/usr/bin/env python

'''
By GPT-5. Runtime: 4m47.509s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from collections import deque
from typing import Tuple, Deque, List

def d_subtractive(n: int, m: int) -> int:
    if m > n:
        n, m = m, n
    steps: int = 0
    while m:
        q, r = divmod(n, m)
        steps += q
        n, m = m, r
    return steps - 1

def inv_mod(a: int, mod: int) -> int:
    t0: int = 0
    t1: int = 1
    r0: int = mod
    r1: int = a % mod
    while r1:
        q: int = r0 // r1
        r0, r1 = r1, r0 - q * r1
        t0, t1 = t1, t0 - q * t1
    if r0 != 1:
        raise ValueError("no inverse")
    return t0 % mod

def can_represent(n: int, x: int, y: int) -> bool:
    if x == 0 or y == 0:
        return False
    if x < y:
        x, y = y, x
    inv: int = inv_mod(x % y, y)
    a0: int = (n % y) * inv % y
    return x * a0 <= n

def f_search(n: int, max_B: int = 80) -> int:
    F: List[int] = [0, 1]
    for _ in range(max_B + 5):
        F.append(F[-1] + F[-2])
    for B in range(1, max_B + 1):
        q: Deque[Tuple[int, int, int]] = deque()
        q.append((2, 1, 1))
        best_m: int | None = None
        while q:
            x, y, length = q.popleft()
            if length > B:
                continue
            if x < y:
                x, y = y, x
            s: int = B - length
            max_xy: int = x
            min_xy: int = y
            if max_xy < min_xy:
                max_xy, min_xy = min_xy, max_xy
            max_possible: int = F[s + 1] * max_xy + F[s] * min_xy
            if max_possible < n:
                continue
            if not can_represent(n, x, y):
                continue
            if x == n or y == n:
                m_candidate: int = y if x == n else x
                if best_m is None or m_candidate < best_m:
                    best_m = m_candidate
                continue
            if length == B:
                continue
            a1, b1 = x + y, x
            if a1 < b1:
                a1, b1 = b1, a1
            q.append((a1, b1, length + 1))
            a2, b2 = x + y, y
            if a2 < b2:
                a2, b2 = b2, a2
            q.append((a2, b2, length + 1))
        if best_m is not None:
            return best_m
    raise RuntimeError("No solution found up to max_B")

if __name__ == "__main__":
    assert f_search(7) == 2
    assert f_search(89) == 34
    assert f_search(8191) == 1856
    print(f_search(10**12 + 39, max_B=80))
