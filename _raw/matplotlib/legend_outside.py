#!/usr/bin/env python
"""
http://stackoverflow.com/questions/4700614/how-to-put-the-legend-out-of-the-plot
"""
def plot(plt, params):
    plt.plot([0, 1, 2, 3], label="x")
    plt.plot([0, 1, 4, 9], label="x^2")
    plt.legend(loc='center left', bbox_to_anchor=(1, 0.5))
