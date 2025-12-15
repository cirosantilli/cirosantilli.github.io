#!/usr/bin/env python3

# Adapted from https://github.com/lucky-bai/projecteuler-solutions/issues/105
# Runtime: 0m1.709s for final solution only (comment out others) on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.

from bisect import bisect_left
from typing import Dict, List, Tuple


def _ceil_div_pow2(x: int, s: int) -> int:
    if s == 0:
        return x
    d = 1 << s
    return (x + (d - 1)) >> s if x >= 0 else -((-x) >> s)


def _simplest_between(u: int, d: int, e: int) -> int:
    for m in range(e + 1):
        s = e - m
        p_min = (u >> s) + 1
        p_max = _ceil_div_pow2(d, s) - 1
        if p_min <= p_max:
            if p_min > 0:
                p = p_min
            elif p_max < 0:
                p = p_max
            else:
                p = 0
            if m > 0 and p and (p & 1) == 0:
                if p + 1 <= p_max and ((p + 1) & 1):
                    p += 1
                elif p - 1 >= p_min and ((p - 1) & 1):
                    p -= 1
            return p << s
    return 0


def _compute_u_hot(n: int) -> Tuple[List[int], List[int]]:
    e = n
    scale = 1 << e
    total = (1 << (n + 1)) - 1
    dp_u = [0] * total
    dp_d = [0] * total
    start1 = 1
    dp_u[start1] = scale
    dp_d[start1] = scale
    dp_u[start1 + 1] = -scale
    dp_d[start1 + 1] = -scale
    hot = [0] * (1 << n)
    for length in range(2, n + 1):
        size = 1 << length
        start = (1 << length) - 1
        for bits in range(size):
            u_raw = -(2**31)
            for s_len in range(1, length):
                suf = bits & ((1 << s_len) - 1)
                cand = dp_d[((1 << s_len) - 1) + suf]
                if cand > u_raw:
                    u_raw = cand
            d_raw = (2**31) - 1
            for p_len in range(1, length):
                pre = bits >> (length - p_len)
                cand = dp_u[((1 << p_len) - 1) + pre]
                if cand < d_raw:
                    d_raw = cand
            idx = start + bits
            if u_raw < d_raw:
                x = _simplest_between(u_raw, d_raw, e)
                dp_u[idx] = x
                dp_d[idx] = x
                if length == n:
                    hot[bits] = 0
            else:
                dp_u[idx] = u_raw
                dp_d[idx] = d_raw
                if length == n:
                    hot[bits] = 1
    start_n = (1 << n) - 1
    u_full = dp_u[start_n : start_n + (1 << n)]
    return u_full, hot


def _hist_from_values(values: List[int], mod: int) -> Dict[int, int]:
    hist: Dict[int, int] = {}
    for v in values:
        hist[v] = (hist.get(v, 0) + 1) % mod
    return {k: c for k, c in hist.items() if c != 0}


def _convolve(a: Dict[int, int], b: Dict[int, int], mod: int) -> Dict[int, int]:
    if not a or not b:
        return {}
    if len(a) > len(b):
        a, b = b, a
    out: Dict[int, int] = {}
    for xa, ca in a.items():
        for xb, cb in b.items():
            k = xa + xb
            out[k] = (out.get(k, 0) + (ca * cb) % mod) % mod
    return {k: c for k, c in out.items() if c != 0}


def _pow_small(hist: Dict[int, int], t: int, mod: int) -> Dict[int, int]:
    if t == 0:
        return {0: 1}
    d = dict(hist)
    for _ in range(1, t):
        d = _convolve(d, hist, mod)
    return d


def _count_sum_lt_zero(a: Dict[int, int], b: Dict[int, int], mod: int) -> int:
    b_items = sorted(b.items())
    b_sums = [s for s, _ in b_items]
    pref = [0]
    run = 0
    for _, c in b_items:
        run = (run + c) % mod
        pref.append(run)
    ans = 0
    for sa, ca in a.items():
        idx = bisect_left(b_sums, -sa)
        ans = (ans + ca * pref[idx]) % mod
    return ans


def _count_sum_eq_zero(a: Dict[int, int], b: Dict[int, int], mod: int) -> int:
    if len(a) > len(b):
        a, b = b, a
    ans = 0
    for s, ca in a.items():
        cb = b.get(-s, 0)
        ans = (ans + ca * cb) % mod
    return ans


def G(n: int, k: int, mod: int = 1001001011) -> int:
    if k % 2 == 0:
        raise ValueError("k must be odd")
    if n <= 0:
        raise ValueError("n must be positive")
    u_full, hot = _compute_u_hot(n)
    u_hist = _hist_from_values(u_full, mod)
    cold_values = [u_full[i] for i, h in enumerate(hot) if h == 0]
    cold_hist = _hist_from_values(cold_values, mod)
    a = k // 2
    b = k - a
    dist_a = _pow_small(u_hist, a, mod)
    dist_b = _pow_small(u_hist, b, mod)
    neg = _count_sum_lt_zero(dist_a, dist_b, mod)
    cold_a = _pow_small(cold_hist, a, mod)
    cold_b = _pow_small(cold_hist, b, mod)
    zero_cold = _count_sum_eq_zero(cold_a, cold_b, mod)
    return (neg + zero_cold) % mod


if __name__ == "__main__":
    assert G(4, 3, 2**64) == 496
    assert G(8, 5, 2**64) == 26359197010
    print(G(20, 7, 1001001011))
