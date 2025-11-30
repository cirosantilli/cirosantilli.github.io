#!/usr/bin/env python

'''
By GPT-5. Runtime: 53.2s on pypy3 3.11.13, Ubuntu 25.10, Lenovo ThinkPad P14s.
'''

# Save as solve_euler_972.py and run: python solve_euler_972.py
from math import gcd
from collections import defaultdict
from math import lcm
import time

def rationals_pairs(N):
    lst = []
    for d in range(1, N+1):
        for n in range(-d+1, d):
            if gcd(abs(n), d) == 1:
                lst.append((n, d))
    return lst

def build_points(N):
    X = rationals_pairs(N)
    pts = []
    # For each pair of rational coords (x = nx/dx, y = ny/dy) keep if inside unit circle
    for nx, dx in X:
        dx2 = dx*dx
        for ny, dy in X:
            dy2 = dy*dy
            if nx*nx * dy2 + ny*ny * dx2 < dx2 * dy2:
                pts.append((nx, dx, ny, dy))
    return pts

def to_scaled_components(nx1,dx1, ny1,dy1, nx2,dx2, ny2,dy2):
    D1 = lcm(dx1, dy1)
    X1 = nx1 * (D1 // dx1)
    Y1 = ny1 * (D1 // dy1)
    D2 = lcm(dx2, dy2)
    X2 = nx2 * (D2 // dx2)
    Y2 = ny2 * (D2 // dy2)
    D = lcm(D1, D2)
    mul1 = D // D1
    mul2 = D // D2
    X1 *= mul1; Y1 *= mul1
    X2 *= mul2; Y2 *= mul2
    return X1, Y1, X2, Y2, D

def normalized_dir_from_scaled(X, Y):
    xi = X; yi = Y
    if xi == 0 and yi == 0:
        return (0,0)
    g = gcd(abs(xi), abs(yi))
    xi //= g; yi //= g
    if xi < 0 or (xi == 0 and yi < 0):
        xi = -xi; yi = -yi
    return (xi, yi)

def geodesic_id_fast_int(p, q):
    nx1,dx1, ny1,dy1 = p
    nx2,dx2, ny2,dy2 = q
    X1, Y1, X2, Y2, D = to_scaled_components(nx1,dx1, ny1,dy1, nx2,dx2, ny2,dy2)
    cross = X1 * Y2 - Y1 * X2
    if cross == 0:
        if X1 == 0 and Y1 == 0:
            dirpair = normalized_dir_from_scaled(X2, Y2)
        else:
            dirpair = normalized_dir_from_scaled(X1, Y1)
        return ('L', dirpair)
    # R1 = X1^2 + Y1^2 + D^2 ; R2 similar
    R1 = X1*X1 + Y1*Y1 + D*D
    R2 = X2*X2 + Y2*Y2 + D*D
    # integer numerators for center formula (see explanation)
    numx = R1 * Y2 - Y1 * R2
    numy = X1 * R2 - R1 * X2
    den = 2 * D * cross
    if den < 0:
        den = -den; numx = -numx; numy = -numy
    g = gcd(gcd(abs(numx), abs(numy)), den)
    if g > 1:
        numx //= g; numy //= g; den //= g
    return ('C', (numx, numy, den))

def compute_T(N, show_stats=False):
    pts = build_points(N)
    n = len(pts)
    start = time.time()
    geods = {}
    for i in range(n):
        p = pts[i]
        for j in range(i+1, n):
            gid = geodesic_id_fast_int(p, pts[j])
            if gid in geods:
                s = geods[gid]
                s.add(i); s.add(j)
            else:
                geods[gid] = {i, j}
    total = 0
    for s in geods.values():
        k = len(s)
        if k >= 3:
            total += k*(k-1)*(k-2)
    if show_stats:
        print("points:", n, "distinct geodesics:", len(geods), "time:", time.time()-start)
    return total

if __name__ == "__main__":
    # verify small cases
    print("T(2) should be 24; computed:", compute_T(2))
    print("T(3) should be 1296; computed:", compute_T(3))
    # compute T(12)
    t12 = compute_T(12, show_stats=True)
    print("T(12) =", t12)

