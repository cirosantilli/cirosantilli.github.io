#!/usr/bin/env python

def plot( plt, params ):
    ax = plt.gca()
    ax.plot([0,1])
    ax.get_xaxis().set_ticks([0.0,0.25,0.75])
    #ax.get_xaxis().set_ticks([]) #remove ticks
    for label in ax.get_xticklabels():
        label.set_color('orange')
    for tick in ax.get_yticklines():
        tick.set_visible(False)
