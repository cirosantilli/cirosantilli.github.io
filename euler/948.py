#!/usr/bin/env python

'''
By GPT-5. Runtime: 0.3s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

from functools import lru_cache
from itertools import product


def compute_catalans(m_max):
    """Return list Cat[0..m_max] of Catalan numbers."""
    Cat = [0] * (m_max + 1)
    Cat[0] = 1
    for n in range(1, m_max + 1):
        s = 0
        for i in range(n):
            s += Cat[i] * Cat[n - 1 - i]
        Cat[n] = s
    return Cat


def compute_F(n_max):
    """
    Compute F(n) for 1 <= n <= n_max using:
      - C_n = 2^(n-2) (RL endpoints),
      - A_n = # of (L,R)-words with LL endpoints,
      - B_n = # of (L,R)-words with LR endpoints,
      - F(n) = 2*A_n + B_n + C_n.

    Recurrences:
      A_1 = A_2 = 0, B_1 = B_2 = 0
      C_n = 2^(n-2) for n >= 2, C_1 = 0

      For m >= 1:
        n = 2m:
          A_{2m}   = 2*A_{2m-1}
          B_{2m}   = 2*B_{2m-1} + Cat_{m-1}

        n = 2m+1:
          A_{2m+1} = 2*A_{2m}   + Cat_{m-1}
          B_{2m+1} = 2*B_{2m}
    """
    m_max = n_max // 2
    Cat = compute_catalans(m_max)

    A = [0] * (n_max + 1)  # LL endpoints
    B = [0] * (n_max + 1)  # LR endpoints
    C = [0] * (n_max + 1)  # RL endpoints

    # Base values
    # n = 1
    A[1] = 0
    B[1] = 0
    C[1] = 0

    if n_max >= 2:
        # n = 2
        A[2] = 0
        B[2] = 0
        C[2] = 1  # 2^(2-2)

    # Fill recurrences
    for n in range(3, n_max + 1):
        C[n] = 1 << (n - 2)  # 2^(n-2)
        if n % 2 == 0:
            # n = 2m
            m = n // 2
            A[n] = 2 * A[n - 1]
            B[n] = 2 * B[n - 1] + Cat[m - 1]
        else:
            # n = 2m + 1
            m = (n - 1) // 2
            A[n] = 2 * A[n - 1] + Cat[m - 1]
            B[n] = 2 * B[n - 1]

    F = [0] * (n_max + 1)
    for n in range(1, n_max + 1):
        F[n] = 2 * A[n] + B[n] + C[n]

    return F, A, B, C, Cat


# --- Optional brute-force checker for small n -------------------------------

def winners_for_word(s):
    """Return (winner_if_Left_starts, winner_if_Right_starts) for a given word s."""
    n = len(s)

    @lru_cache(None)
    def solve(i, j, player):
        # player: 0 = Left, 1 = Right
        if i == j:
            return s[i]  # 'L' or 'R'

        if player == 0:  # Left to move
            desired, other = 'L', 'R'
            for k in range(1, j - i + 1):  # remove k from the left (1..j-i)
                w = solve(i + k, j, 1)
                if w == desired:
                    return desired
            return other
        else:  # Right to move
            desired, other = 'R', 'L'
            for k in range(1, j - i + 1):  # remove k from the right
                w = solve(i, j - k, 0)
                if w == desired:
                    return desired
            return other

    wl = solve(0, n - 1, 0)
    wr = solve(0, n - 1, 1)
    return wl, wr


def F_bruteforce(n):
    """Naively compute F(n) by enumerating all 2^n words (for small n)."""
    cnt = 0
    for bits in product('LR', repeat=n):
        s = ''.join(bits)
        wl, wr = winners_for_word(s)
        if wl == 'L' and wr == 'R':
            cnt += 1
    return cnt


if __name__ == "__main__":
    # Sanity check: compare recurrence vs brute force for small n
    F, A, B, C, Cat = compute_F(60)
    for n in range(1, 11):
        fb = F_bruteforce(n)
        print(f"n={n:2d}  brute={fb:4d}  recurrence={F[n]:4d}  match={fb == F[n]}")

    # Finally, print F(60)
    print("F(60) =", F[60])

