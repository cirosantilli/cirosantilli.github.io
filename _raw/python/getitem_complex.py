#!/usr/bin/env python

class C(object):
    def __getitem__(self, k):
        return k

# Single argument is passed directly.
assert C()[0] == 0

# Multiple indices generate a tuple.
assert C()[0, 1] == (0, 1)

# Slice notation generates a slice object.
assert C()[1:2:3] == slice(1, 2, 3)

# Empty slice entries become None.
assert C()[:2:] == slice(None, 2, None)

# Ellipsis notation generates the Ellipsis class object.
# Ellipsis is a singleton, so we can compare with `is`.
assert C()[...] is Ellipsis

# Everything mixed up.
assert C()[1, 2:3:4, ..., 6, :7:, ..., 8] == \
       (1, slice(2,3,4), Ellipsis, 6, slice(None,7,None), Ellipsis, 8)
