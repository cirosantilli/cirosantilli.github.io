#!/usr/bin/env python3

from dataclasses import dataclass

@dataclass(slots=True)
class C:
    n: int
    s: str

c = C(n=1, s='one')
assert c.n == 1
assert c.s == 'one'
c.n == 2
c.s == 'two'
c.asdf = 2
