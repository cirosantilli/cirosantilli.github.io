#!/usr/bin/env python3
class C:
    def __init__(self, x0, x1):
        self.x0 = x0
        self.x1 = x1

    def __getitem__(self, i):
        if i == 0:
            return self.x0
        elif i == 1:
            return self.x1
        else:
            raise IndexError(i)
c = C(1, 2)
assert c[0] == 1
assert c[1] == 2
x0, x1 = c
assert x0 == 1
assert x1 == 2
