#!/usr/bin/env python
import sys
s = 0
for i in range(1, int(sys.argv[1]), 2):
    s += i*i
print(s)
