#!/usr/bin/env python
"""
http://stackoverflow.com/questions/4971269/how-to-pick-a-new-color-for-each-plotted-line-within-a-figure-in-matplotlib/39522128#39522128
"""
from cycler import cycler
def plot(plt, default_params):
    plt.rc('axes', prop_cycle=(cycler('color', ['r', 'g', 'b'])))
    plt.plot([1, 2])
    plt.plot([2, 3])
    plt.plot([3, 4])
    plt.plot([4, 5])
    plt.plot([5, 6])
