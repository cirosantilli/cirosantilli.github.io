#!/usr/bin/env python3

from sympy import *

x = symbols('x')
myli = integrate(sympify(1)/ln(x), x)

# It recognizes our definition as its own li! Beauty.
assert myli.equals(li(x))

for r in range(-2, 2):
    for i in range(-2, 2):
        print(f'{r} {i} {li(r + i*I).evalf()}')
