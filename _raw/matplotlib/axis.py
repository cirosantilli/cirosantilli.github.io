#!/usr/bin/env python
def plot(plt, params):
    ax = plt.gca()
    ax.plot([1, 4, 9])
    # Only removes ticks and labels, not bounding box.
    ax.get_xaxis().set_visible(False)
    ax.get_yaxis().set_visible(False)
