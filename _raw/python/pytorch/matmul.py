#!/usr/bin/env python3

# https://cirosantilli.com/_file/python/pytorch/matmul.py

import sys

import torch

print(torch.cuda.is_available())

if len(sys.argv) > 1:
    gpu = sys.argv[1] == 'g'
else:
    gpu = False
if len(sys.argv) > 2:
    n = int(sys.argv[2])
else:
    n = 5
if len(sys.argv) > 3:
    m = int(sys.argv[3])
else:
    m = 5
if len(sys.argv) > 4:
    o = int(sys.argv[4])
else:
    o = 10
if len(sys.argv) > 5:
    repeat = int(sys.argv[5])
else:
    repeat = 10
t1 = torch.ones((n, m))
t2 = torch.ones((m, o))
t3 = torch.zeros(n, o)
if gpu:
    t1 = t1.to('cuda')
    t2 = t2.to('cuda')
    t3 = t3.to('cuda')
for i in range(repeat):
    t3 += t1 @ t2
print(t3)
