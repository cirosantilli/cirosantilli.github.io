#!/usr/bin/env python
"""
Two lines on the same plot.
All points are on a 3 column file, and the first column
decides which line each (x, y) point belongs to.

- http://stackoverflow.com/questions/31863083/python-split-numpy-array-based-on-values-in-the-array
- http://stackoverflow.com/questions/33622888/how-to-plot-2-lines-based-on-the-value-not-column pandas example
"""
import os
import numpy
def plot(plt, params):
    a = numpy.loadtxt(
        os.path.splitext(__file__)[0] + '.dat',
        skiprows=1
    )
    keys = list(set(a[:, 0]))
    for key in keys:
        v = a[a[:, 0] == key, :]
        plt.plot(v[:, 1], v[:, 2], label=int(key))
    plt.legend(loc='upper left')
