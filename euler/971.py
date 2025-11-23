#!/usr/bin/env python

'''
By GPT-5. Runtime: 3.4s on pypy3 3.11.11, Ubuntu 24.04, Lenovo ThinkPad P41s.
'''

from math import isqrt

N = 10**8  # target upper bound for primes

def sieve_primes_upto(n):
    """Return list of primes <= n using odd-only sieve (memory ~ n/2 bytes).
    """
    if n < 2:
        return []
    sieve = bytearray((n//2) + 1)  # index i represents number 2*i+1
    limit = isqrt(n)
    for i in range(1, (limit//2) + 1):
        if sieve[i] == 0:
            p = 2*i + 1
            start = (p*p - 1)//2
            sieve[start::p] = b'\x01' * (((len(sieve) - 1 - start)//p) + 1)
    primes = [2]
    primes.extend([2*i+1 for i, v in enumerate(sieve) if i>0 and v==0 and (2*i+1) <= n])
    return primes

# For mapping on the 5-element subgroup mu5 we will use simple graph traversal to
# classify which elements are on cycles. We represent elements by their canonical
# integer residue in 0..p-1.

def count_periodic_in_mu5(p):
    """For prime p with p % 5 == 1, compute t = number of s in mu5 that are periodic under phi(s)=s*(1+s)^n mod p,
    where n=(p-1)//5. Returns t.
    """
    n = (p-1)//5
    # find an a with a^n != 1, so that zeta = a^n is a generator of mu5 (or at least not 1)
    # in practice small a (2,3,5,7,11...) will work; loop until found.
    a = 2
    zeta = pow(a, n, p)
    while zeta == 1:
        a += 1
        zeta = pow(a, n, p)
    # build mu5 list (five distinct elements)
    mu5 = [1]
    cur = 1
    for _ in range(1,5):
        cur = (cur * zeta) % p
        mu5.append(cur)
    # Map each element to its image under phi (reduced modulo p)
    phi = {}
    for s in mu5:
        one_plus = (1 + s) % p
        # (1+s)^n mod p
        pow_val = pow(one_plus, n, p)
        phi[s] = (s * pow_val) % p
        # phi(s) should remain inside mu5; if not, we still handle generically

    # classify nodes: detect cycles in functional graph phi: mu5 -> residues
    visited = {}  # s -> 0: unvisited, 1: in stack, 2: done
    in_cycle = set()
    for s in mu5:
        if s in visited:
            continue
        path = []
        cur = s
        while True:
            if cur not in visited:
                visited[cur] = 1
                path.append(cur)
                cur = phi.get(cur, None)
                if cur is None:
                    # maps outside mu5 — no cycle within mu5 via this path
                    for node in path:
                        visited[node] = 2
                    break
            else:
                if visited[cur] == 1:
                    # found a cycle: nodes from first occurrence of cur in path to end
                    idx = path.index(cur)
                    cycle_nodes = path[idx:]
                    for node in cycle_nodes:
                        in_cycle.add(node)
                    # mark all nodes in path as done
                    for node in path:
                        visited[node] = 2
                else:
                    # visited[cur] == 2: it leads to a previously processed region (may contain cycle)
                    for node in path:
                        visited[node] = 2
                break
    return len(in_cycle)


def compute_S(limit):
    primes = sieve_primes_upto(limit)
    total = 0
    count_primes = 0
    for p in primes:
        if p < 5:
            if p == 2 or p == 3:
                continue
        if p % 5 != 1:
            continue
        count_primes += 1
        n = (p-1)//5
        t = count_periodic_in_mu5(p)
        C_p = 1 + n * t
        total += C_p
    return total

if __name__ == '__main__':
    # Quick sanity checks
    print('Sanity checks:')
    small_primes = sieve_primes_upto(100)
    # Verify C(11) == 7 as in problem statement
    print('C(11) should be 7 ->', end=' ')
    print(1 + ((11-1)//5) * count_periodic_in_mu5(11))
    # Verify S(100) == 127
    print('S(100) should be 127 ->', end=' ')
    print(compute_S(100))

    # Main computation (uncomment to run full):
    # Note: this will use around ~50 MB memory for the odd-only sieve and may take
    # a few minutes depending on CPU.
    result = compute_S(N)
    print('S(10**8) =', result)
