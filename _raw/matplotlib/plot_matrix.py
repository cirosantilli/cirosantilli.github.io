#!/usr/bin/env python
"""
plot() can take a matrix. Each column is a line.
np.transpose() is a possible way to get such columns easily.

TODO: but can you set labels for those columns?
Maybe with structured ndarrys...
"""
def plot(plt, params):
    plt.plot(
        [
            [0,  0],
            [1,  1],
            [2,  4],
            [3,  9],
            [4, 16],
        ]
    )
