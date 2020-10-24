#!/usr/bin/env python
"""
Plot a matrix, and also control the x position of rows.
"""
def plot(plt, params):
    plt.plot(
        [0, 1, 4, 9, 16],
        [
            [0,  0],
            [1,  1],
            [2,  4],
            [3,  9],
            [4, 16],
        ]
    )
