#!/usr/bin/env python
def plot(plt, params):
    plt.plot([0, 1, 2, 3], label='x')
    plt.plot([0, 1, 4, 9], label='x^2')
    plt.legend(loc='upper left')
