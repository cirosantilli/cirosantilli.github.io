#!/usr/bin/env python
# TODO for https://stackoverflow.com/questions/13359951/is-there-a-list-of-line-styles-in-matplotlib/39505502#39505502
# but it is hard to put that many markers on a picture without them overlapping.
import matplotlib
def plot(plt, params):
    d = [1, 2, 3, 4, 5]
    n = matplotlib.markers.MarkerStyle.markers.keys()
    for i, marker in enumerate(matplotlib.markers.MarkerStyle.markers.keys()):
        plt.plot(d, label=marker, marker=marker)
        d = [v + len(d) for v in reversed(d)]
