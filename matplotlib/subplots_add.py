#!/usr/bin/env python

"""
this is *not* the best method to do subplots:
always use `Figure.subplots` method instead.

2,2,1 is the same as 221 but more computational, so always use use it on
non interactive sessions
"""

def plot( plt, params ):
    fig = plt.figure()
    ax = fig.add_subplot(2, 2, 1)
    ax.plot([0, 0])
    ax = fig.add_subplot(2, 2, 2)
    ax.plot([0, 1])
    ax = fig.add_subplot(2, 2, 3)
    ax.plot([1, 0])
    ax = fig.add_subplot(2, 2, 4)
    ax.plot([1, 1])
