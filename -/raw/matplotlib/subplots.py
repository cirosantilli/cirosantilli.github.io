#!/usr/bin/env python
"""
The best way to do subplots is via the subplots method instead of `add_subplot()`.
"""
import itertools
def plot(plt, default_params):
    fig, axs = plt.subplots(2, 2)
    for x, y in itertools.product([0, 1], [0, 1]):
        ax = axs[x, y];
        ax.plot([x, y])
        ax.set_title('{} {}'.format(x, y))
