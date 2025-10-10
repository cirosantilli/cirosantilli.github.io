#!/usr/bin/env python

def sum_of_multiples(m, n):
    max_range = n // m
    return m * max_range * (max_range + 1) // 2 

t = int(input().strip())
for a0 in range(t):
    n = int(input().strip()) - 1
    print(sum_of_multiples(3, n) + sum_of_multiples(5, n) - sum_of_multiples(15, n))
