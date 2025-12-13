#!/usr/bin/env python

'''
By GPT-5.2. Runtime: 0m0.497s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from functools import lru_cache

DIGITS = [1, 3, 5, 7, 9]
BIT = {1: 0, 3: 1, 5: 2, 7: 3, 9: 4}
ALL = (1 << 5) - 1

def count_len(L: int) -> int:
    @lru_cache(None)
    def dp(pos: int, mod3: int, mod7: int, mask: int) -> int:
        if pos == L:
            return 1 if (mod3 == 0 and mod7 == 0 and mask == ALL) else 0
        choices = (5,) if pos == L - 1 else tuple(DIGITS)
        total = 0
        for d in choices:
            total += dp(
                pos + 1,
                (mod3 * 10 + d) % 3,
                (mod7 * 10 + d) % 7,
                mask ^ (1 << BIT[d]),
            )
        return total
    return dp(0, 0, 0, 0)

def unrank(L: int, k: int) -> str:
    @lru_cache(None)
    def dp(pos: int, mod3: int, mod7: int, mask: int) -> int:
        if pos == L:
            return 1 if (mod3 == 0 and mod7 == 0 and mask == ALL) else 0
        choices = (5,) if pos == L - 1 else tuple(DIGITS)
        total = 0
        for d in choices:
            total += dp(
                pos + 1,
                (mod3 * 10 + d) % 3,
                (mod7 * 10 + d) % 7,
                mask ^ (1 << BIT[d]),
            )
        return total
    mod3 = 0
    mod7 = 0
    mask = 0
    out = []
    for pos in range(L):
        choices = [5] if pos == L - 1 else DIGITS
        for d in choices:
            cnt = dp(
                pos + 1,
                (mod3 * 10 + d) % 3,
                (mod7 * 10 + d) % 7,
                mask ^ (1 << BIT[d]),
            )
            if k > cnt:
                k -= cnt
            else:
                out.append(str(d))
                mod3 = (mod3 * 10 + d) % 3
                mod7 = (mod7 * 10 + d) % 7
                mask ^= (1 << BIT[d])
                break
        else:
            raise RuntimeError
    return "".join(out)

def theta(n: int, maxL: int = 200) -> str:
    cum = 0
    for L in range(1, maxL + 1, 2):
        c = count_len(L)
        if cum + c >= n:
            return unrank(L, n - cum)
        cum += c
    raise ValueError

if __name__ == "__main__":
    assert theta(1, maxL=40) == "1117935"
    assert theta(10**3, maxL=40) == "11137955115"
    print(theta(10**16, maxL=200))

