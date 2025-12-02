#!/usr/bin/env python

def sum_of_multiples(m, n):
    max_range = n // m
    return m * max_range * (max_range + 1) // 2 

def sum_of_multiples_of_either_3_or_5(n):
    n -= 1
    return sum_of_multiples(3, n) + sum_of_multiples(5, n) - sum_of_multiples(15, n)

if __name__ == '__main__':
    assert sum_of_multiples_of_either_3_or_5(10) == 23
    print(sum_of_multiples_of_either_3_or_5(1000))
