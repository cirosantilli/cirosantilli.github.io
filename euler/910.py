#!/usr/bin/env python

#  runtime: 43s on pypy3 11
'''
From https://github.com/lucky-bai/projecteuler-solutions/issues/102 license unknown
Runtime: 34s on pypy3 3.11.11, Ubuntu 25.04, Lenovo ThinkPad P14s.
'''

from __future__ import annotations

"""
Standalone Project Euler 910 solver.

All supporting logic (5-adic helpers, Phi iterators, and the orbit solver)
is consolidated here so this file can run by itself:
    python pe_910_solver.py
"""

from dataclasses import dataclass
from functools import lru_cache
from math import comb
from typing import Callable, Dict, List, Tuple

# Problem-specific constants
PE_B = 345_678
PE_C = 9_012_345
PE_D = 678
MOD_DEFAULT = 10**9


# 5-adic unit helpers -----------------------------------------------------

def modulus_to_k(mod: int) -> int:
    """Return k such that mod = 5^k (assumes mod is a power of 5)."""
    k = 0
    temp = mod
    while temp % 5 == 0 and temp > 1:
        temp //= 5
        k += 1
    return k


def teichmuller_lift(x: int, mod: int) -> int:
    """Compute the Teichmüller lift of x modulo mod (mod = 5^k)."""
    z = x % mod
    k = modulus_to_k(mod)
    for _ in range(k):
        z = pow(z, 5, mod)
    return z


def unit_decompose(x: int, mod: int) -> Tuple[int, int]:
    """
    Decompose a 5-adic unit x modulo mod into (z, u) with
        x = z * (1 + 5u),  z^4 = 1,  u in Z/5^{k-1}Z.
    Returns (z, u).
    """
    z = teichmuller_lift(x, mod)
    inv_z = pow(z, -1, mod)
    y = (x * inv_z) % mod
    k = modulus_to_k(mod)
    if k == 0:
        return z, 0
    u = (y - 1) // 5
    return z, u


@lru_cache(maxsize=None)
def _binom_prefix(exp: int, k: int) -> Tuple[int, ...]:
    """Precompute (C(exp, r) mod 5^k) for r = 0..k."""
    mod = 5**k if k else 1
    coeffs: List[int] = [1]
    for r in range(1, k + 1):
        coeffs.append(comb(exp, r) % mod)
    return tuple(coeffs)


def one_plus_5u_pow(u: int, exp: int, mod: int) -> int:
    """
    Compute (1 + 5u)^exp modulo mod (mod = 5^k) via truncated binomial series.
    """
    k = modulus_to_k(mod)
    if k == 0:
        return 1 % mod
    coeffs = _binom_prefix(exp, k)
    res = 1
    base = (5 * u) % mod
    pow_term = base
    for r in range(1, k + 1):
        res = (res + (coeffs[r] * pow_term) % mod) % mod
        pow_term = (pow_term * base) % mod
    return res


def unit_pow(x: int, exp: int, mod: int) -> int:
    """Raise a 5-adic unit x to exponent exp modulo mod using the decomposition."""
    k = modulus_to_k(mod)
    if k == 0 or x % 5 == 0:
        return pow(x, exp, mod)
    z, u = unit_decompose(x, mod)
    z_pow = pow(z, exp % 4, mod)
    tup = one_plus_5u_pow(u, exp, mod)
    return (z_pow * tup) % mod


# Inner g-iterator for modulo 5^k ----------------------------------------

class GCIterator:
    """
    Lazy binary-lifting iterator for the inner map g(c, x) = x^c (x + 1) mod 5^k.
    Provides fast evaluation of Phi_0(x) = g_c^{∘ b}(g_{c+1}(x)).
    """

    def __init__(self, mod: int):
        self.mod = mod
        self.jump_cache: List[Dict[int, int]] = [{} for _ in range(PE_B.bit_length() + 1)]
        self.k = modulus_to_k(mod)
        self.unit_cache: Dict[int, Tuple[int, int]] = {}
        self.cycle_cache: Dict[int, Tuple[int, int]] = {}

    def _pow_unit(self, x: int, exp: int) -> int:
        m = self.mod
        if m == 1:
            return 0
        if x % 5 == 0:
            return pow(x, exp, m)
        cache = self.unit_cache
        if x not in cache:
            cache[x] = unit_decompose(x, m)
        z, u = cache[x]
        z_pow = pow(z, exp % 4 or 4, m)
        tup = one_plus_5u_pow(u, exp, m)
        return (z_pow * tup) % m

    def g_c(self, x: int) -> int:
        m = self.mod
        pow_part = self._pow_unit(x, PE_C)
        return (pow_part * ((x + 1) % m)) % m

    def g_cplus1(self, x: int) -> int:
        m = self.mod
        pow_part = self._pow_unit(x, PE_C + 1)
        return (pow_part * ((x + 1) % m)) % m

    def jump(self, level: int, x: int) -> int:
        """Compute g_c^{∘ 2^level}(x) modulo mod, lazily cached."""
        x %= self.mod
        cache = self.jump_cache[level]
        if x in cache:
            return cache[x]
        if level == 0:
            val = self.g_c(x)
        else:
            mid = self.jump(level - 1, x)
            val = self.jump(level - 1, mid)
        cache[x] = val
        return val

    def iterate_steps(self, steps: int, x: int) -> int:
        """Apply g_c exactly `steps` times starting from x using binary lifting."""
        res = x % self.mod
        bit = 0
        s = steps
        while s:
            if s & 1:
                res = self.jump(bit, res)
            s >>= 1
            bit += 1
        return res

    def Phi0(self, x: int) -> int:
        """Phi_0(x) = h(b+1, c, x) modulo mod."""
        y0 = self.g_cplus1(x % self.mod)
        return self.iterate_steps(PE_B + 1, y0)


# Cycle-accelerated generic helpers --------------------------------------

def g_mod(c: int, x: int, mod: int) -> int:
    """g(c, x) = x^c * (x + 1) modulo mod."""
    return (pow(x, c, mod) * ((x + 1) % mod)) % mod


def h_mod(b: int, c: int, x: int, mod: int) -> int:
    """
    h(b, c, x):
      t = g(c+1, x);
      then apply g(c, ·) exactly b times.
    """
    t = g_mod(c + 1, x, mod)
    for _ in range(b):
        t = g_mod(c, t, mod)
    return t


def iterate_with_cycle(
    f: Callable[[int], int],
    x0: int,
    n: int,
    mod: int,
    max_steps: int | None = None,
) -> int:
    """
    Compute f^n(x0) modulo mod using Floyd's cycle-finding algorithm.

    Intended for small mod (e.g., 2^9 or 5^9) and huge n.
    """
    if n == 0:
        return x0 % mod

    tortoise = f(x0) % mod
    hare = f(f(x0) % mod) % mod
    steps = 0
    if max_steps is None:
        max_steps = mod * 4  # generous upper bound

    while tortoise != hare and steps < max_steps:
        tortoise = f(tortoise) % mod
        hare = f(f(hare) % mod) % mod
        steps += 1

    if steps >= max_steps:
        # Fallback: simple iteration (used only in tiny test cases)
        x = x0 % mod
        for _ in range(n):
            x = f(x) % mod
        return x

    # Find mu (cycle start)
    mu = 0
    tortoise = x0 % mod
    while tortoise != hare and mu < max_steps:
        tortoise = f(tortoise) % mod
        hare = f(hare) % mod
        mu += 1

    # Find lambda (cycle length)
    lam = 1
    hare = f(tortoise) % mod
    while tortoise != hare and lam < max_steps:
        hare = f(hare) % mod
        lam += 1

    if n < mu:
        x = x0 % mod
        for _ in range(n):
            x = f(x) % mod
        return x

    # Move to position mu
    x = x0 % mod
    for _ in range(mu):
        x = f(x) % mod

    rem = (n - mu) % lam
    for _ in range(rem):
        x = f(x) % mod
    return x


def h_mod_cycle(b: int, c: int, x: int, mod: int) -> int:
    """Cycle-accelerated version of h_mod for large b and small mod."""
    x1 = g_mod(c + 1, x, mod)
    if b == 0:
        return x1
    f = lambda y: g_mod(c, y, mod)
    return iterate_with_cycle(f, x1, b, mod)


def Phi0_mod(E: int, b: int, c: int, mod: int = MOD_DEFAULT) -> int:
    """Phi_0(E) = h(b+1, c, E) modulo mod."""
    return h_mod(b + 1, c, E, mod)


def Phi0_mod_cycle(E: int, b: int, c: int, mod: int = MOD_DEFAULT) -> int:
    """
    Phi_0(E) using cycle detection on h_mod; suited for large b and small mod.
    """
    return h_mod_cycle(b + 1, c, E, mod)


def Phi_a_mod(a: int, E: int, b: int, c: int, mod: int = MOD_DEFAULT) -> int:
    """
    Compute Phi_a(E) via the outer update (naive for small parameters).
    """

    def phi0(x: int) -> int:
        return Phi0_mod(x, b, c, mod)

    if a == 0:
        return phi0(E)

    Phi_funcs: List[Callable[[int], int]] = [phi0]

    for _k in range(a):
        prev = Phi_funcs[-1]

        def make_next(prev_func: Callable[[int], int]) -> Callable[[int], int]:
            def next_func(x: int) -> int:
                s = (x * prev_func(x)) % mod
                for _ in range(b):
                    s = prev_func(s) % mod
                return s

            return next_func

        Phi_funcs.append(make_next(prev))

    return Phi_funcs[a](E)


def Phi_a_mod_cycle(a: int, E: int, b: int, c: int, mod: int = MOD_DEFAULT) -> int:
    """
    Cycle-accelerated Phi_a(E) for large b and small mod.
    """

    def phi0(x: int) -> int:
        return Phi0_mod_cycle(x, b, c, mod)

    if a == 0:
        return phi0(E)

    Phi_funcs: List[Callable[[int], int]] = [phi0]

    for _k in range(a):
        prev = Phi_funcs[-1]

        def make_next(prev_func: Callable[[int], int]) -> Callable[[int], int]:
            def next_func(x: int) -> int:
                s0 = (x * prev_func(x)) % mod

                def f(y: int) -> int:
                    return prev_func(y) % mod

                return iterate_with_cycle(f, s0, b, mod)

            return next_func

        Phi_funcs.append(make_next(prev))

    return Phi_funcs[a](E)


def T_mod(a: int, b: int, c: int, d: int, mod: int = MOD_DEFAULT) -> int:
    """T(a, b, c, d) modulo mod using the naive Phi_a recurrence."""
    return Phi_a_mod(a, d, b, c, mod)


def T_mod_cycle(a: int, b: int, c: int, d: int, mod: int = MOD_DEFAULT) -> int:
    """T(a, b, c, d) modulo mod using cycle-accelerated Phi_a."""
    return Phi_a_mod_cycle(a, d, b, c, mod)


# Orbit-focused Phi solver for 5^k ---------------------------------------

class JumpIter:
    """Binary-lifting iterator for an arbitrary function f: X -> X mod m."""

    def __init__(self, f: Callable[[int], int], mod: int, max_bits: int):
        self.f = f
        self.mod = mod
        self.jump: List[Dict[int, int]] = [dict() for _ in range(max_bits)]

    def _step(self, x: int) -> int:
        return self.f(x) % self.mod

    def _jump(self, bit: int, x: int) -> int:
        cache = self.jump[bit]
        xm = x % self.mod
        if xm in cache:
            return cache[xm]
        if bit == 0:
            val = self._step(xm)
        else:
            mid = self._jump(bit - 1, xm)
            val = self._jump(bit - 1, mid)
        cache[xm] = val
        return val

    def pow(self, x: int, n: int) -> int:
        res = x % self.mod
        bit = 0
        nn = n
        while nn:
            if nn & 1:
                res = self._jump(bit, res)
            nn >>= 1
            bit += 1
        return res


@dataclass
class OrbitPhiSolver:
    """
    Orbit-focused Phi_a solver for the PE 910 parameters modulo 5^k (k ≤ 9).
    Uses memoization and cycle detection along the orbit starting at d = 678.
    """

    mod: int
    cache: List[Dict[int, int]]
    g_iter: GCIterator

    def __init__(self, mod: int):
        self.mod = mod
        self.cache = []  # cache[a][x] = Phi_a(x)
        self.jump_iters: List[JumpIter | None] = []
        self.g_iter = GCIterator(mod)
        self.phi0_table = None
        if mod <= 2_000_000:  # up to 5^9 = 1,953,125
            self._build_phi0_table()

    def phi(self, a: int, x: int) -> int:
        """Phi_a(x) modulo self.mod (specialized to PE b,c)."""
        xm = x % self.mod
        self._ensure_level(a)
        cache_a = self.cache[a]
        if xm in cache_a:
            return cache_a[xm]

        if a == 0:
            if self.phi0_table is not None:
                val = self.phi0_table[xm]
            else:
                val = self.g_iter.Phi0(xm)
        else:
            prev = self.phi(a - 1, xm)
            s0 = (xm * prev) % self.mod
            it = self._ensure_jump_iter(a - 1)
            val = it.pow(s0, PE_B)

        cache_a[xm] = val
        return val

    def _build_phi0_table(self) -> None:
        """Precompute Phi0(x) for all residues modulo mod."""
        mod = self.mod
        table = [0] * mod
        for x in range(mod):
            table[x] = self.g_iter.Phi0(x)
        self.phi0_table = table

    def _ensure_level(self, a: int) -> None:
        while len(self.cache) <= a:
            self.cache.append({})
            self.jump_iters.append(None)

    def _ensure_jump_iter(self, level: int) -> JumpIter:
        self._ensure_level(level)
        it = self.jump_iters[level]
        if it is None:
            max_bits = PE_B.bit_length() + 1
            it = JumpIter(lambda y, lvl=level: self.phi(lvl, y), self.mod, max_bits)
            self.jump_iters[level] = it
        return it

    def U_sequence(self, a_max: int) -> List[int]:
        """Compute [Phi_a(PE_D) mod mod for a=0..a_max]."""
        return [self.phi(a, PE_D) for a in range(a_max + 1)]


# Top-level T(a,b,c,d) modulo specific powers -----------------------------

def T_mod_2pow9(a: int, b: int, c: int, d: int, e: int = 0) -> int:
    mod = 2**9
    m = mod
    Phi = [[0] * m for _ in range(a + 1)]

    for x in range(m):
        Phi[0][x] = Phi0_mod_cycle(x, b, c, mod)

    for k in range(0, a):
        prev = Phi[k]
        curr = Phi[k + 1]

        def f(y: int, table=prev) -> int:
            return table[y]

        for x in range(m):
            s0 = (x * prev[x]) % mod
            curr[x] = iterate_with_cycle(f, s0, b, mod)

    return (Phi[a][d % mod] + e) % mod


def T_mod_5pow9(a: int, b: int, c: int, d: int, e: int = 0) -> int:
    mod = 5**9
    if b == PE_B and c == PE_C:
        solver = OrbitPhiSolver(mod)
        return (solver.phi(a, d) + e) % mod
    return (T_mod_cycle(a, b, c, d, mod) + e) % mod


def T_mod_1e9(a: int, b: int, c: int, d: int, e: int = 0) -> int:
    mod2 = 2**9
    mod5 = 5**9
    t2 = T_mod_2pow9(a, b, c, d, e)
    t5 = T_mod_5pow9(a, b, c, d, e)
    inv_mod2_mod5 = pow(mod2, -1, mod5)
    k = ((t5 - t2) * inv_mod2_mod5) % mod5
    x = t2 + k * mod2
    return x % (mod2 * mod5)


def solve() -> int:
    a = 12
    b = PE_B
    c = PE_C
    d = PE_D
    e = 90
    return T_mod_1e9(a, b, c, d, e)


if __name__ == "__main__":
    print(solve())
