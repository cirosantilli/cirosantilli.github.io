from math import comb, factorial

'''
By GPT-5. Runtime: 0m0.249s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

MOD = 10**9 + 7

def F(n: int) -> int:
    S = 0
    inv2 = (MOD + 1) // 2
    for k in range(1, n // 2 + 1):
        trees_k = 1 if k == 1 else pow(k, k - 2, MOD)
        trees_nk = pow(n - k, n - k - 2, MOD)
        ways = comb(n, k)
        ways %= MOD
        ways = ways * trees_k % MOD
        ways = ways * trees_nk % MOD
        ways = ways * k % MOD
        ways = ways * (n - k) % MOD
        if 2 * k == n:
            ways = ways * inv2 % MOD
        S = (S + k * ways) % MOD
    return S * factorial(n - 1) % MOD

assert F(3) == 12
assert F(4) == 360
print(F(100))
