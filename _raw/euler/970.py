'''
By GPT-5. Instant solution on pypy3.
'''

import mpmath as mp

def first_eight_non6_digits(n: int, dps: int = 200) -> str:
    """
    Returns the first eight digits after the decimal point of H(n) that are different from 6.
    Uses the asymptotic representation:
      H(n) = 2n + 2/3 + 2*Re(e^{λ n}/λ) + (exponentially tiny terms),
    where λ = 1 + W_1(-e^{-1}) and the conjugate λ̄ has the same contribution via the cosine.
    For very large n (like 10^6) this is exact for all practical purposes.

    dps controls working precision; 200 is plenty for n up to ~1e9.
    """
    mp.mp.dps = dps

    # Dominant complex root: λ = 1 + W_1(-e^{-1})  (branch k=1)
    lam = 1 + mp.lambertw(-mp.e**-1, 1)  # complex
    # Precompute modulus and argument of λ
    lam_abs = mp.fabs(lam)
    lam_arg = mp.arg(lam)

    # Phase θ = Im(λ)*n - arg(λ); reduce mod 2π carefully at high precision
    two_pi = 2 * mp.pi
    theta = mp.im(lam) * n - lam_arg
    # Bring to principal value to keep cos well-conditioned
    theta = mp.fmod(theta, two_pi)
    if theta > mp.pi:
        theta -= two_pi
    elif theta < -mp.pi:
        theta += two_pi

    c = mp.cos(theta)  # this incorporates the conjugate root automatically
    # If cos is (pathologically) ~0, we could fall back to next pole; but that is astronomically unlikely.

    # Log10 of the tiny correction ε = 2*Re(e^{λ n}/λ) = (2/|λ|) * e^{Re(λ) n} * cosθ
    a = mp.log10(2 / lam_abs) + (mp.re(lam) * n) / mp.log(10) + mp.log10(mp.fabs(c))

    # L = number of leading '6's after the decimal point in H(n)
    L = int(mp.floor(-a))

    # Mantissa of ε scaled to ~[0.1, 1]: δ = ε * 10^L  (preserves sign)
    delta_mag = mp.power(10, a + L)
    delta = mp.sign(c) * delta_mag

    # Now form s = 2/3 + δ. The "first eight digits that are not 6"
    # in H(n)'s fractional part equal the first eight non-6 digits of s's fractional expansion.
    s = mp.mpf(2) / 3 + delta

    # Extract digits after the decimal point, skipping any '6's, until we have 8
    res = []
    frac = s - mp.floor(s)
    # Iterate enough steps; we usually need only ~10–20 here
    for _ in range(200):
        frac *= 10
        d = int(mp.floor(frac))
        if d != 6:
            res.append(str(d))
            if len(res) == 8:
                break
        frac -= d

    if len(res) < 8:
        raise RuntimeError("Did not collect 8 non-6 digits; increase precision or loop bound.")

    return "".join(res)

if __name__ == "__main__":
    # Example calls (H(2) and H(3) values in the problem statement are *not* from the asymptotic;
    # for very small n the neglected poles matter. For n = 10**6 this method is effectively exact.)
    n = 10**6
    print(first_eight_non6_digits(n, dps=220))
