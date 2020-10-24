import math
import numpy as np
import matplotlib

"""
Setup for a typical explanatory-style illustration style graph.
"""

def plot(plt, params):
    h = 2
    x = np.linspace(-np.pi, np.pi, 100)
    y = h * np.sin(x)
    rc = {
        # Tick in the middle of the axis line.
        'xtick.direction' : 'inout',
        'ytick.direction' : 'inout',

        # Bold is easier to read when we have few ticks.
        'font.weight': 'bold',
    }
    with plt.rc_context(rc):
        fig, ax = plt.subplots()
        ax.plot(x, y)
        ax.set_title(
            'y = ' + str(h) + ' sin(x), not $\\sqrt{2\\pi}$',
            # TODO make LaTeX part bold?
            # https://stackoverflow.com/questions/14324477/bold-font-weight-for-latex-axes-label-in-matplotlib
            fontweight='bold',
            # Too close otherwise.
            # https://stackoverflow.com/questions/16419670/increase-distance-between-title-and-plot-in-matplolib/56738085
            pad=20
        )
        ax.set_xlabel('x', weight='bold')
        ax.xaxis.set_label_coords(1.0, 0.6)
        ax.set_ylabel('y', rotation=0, weight='bold', va='center')
        ax.yaxis.set_label_coords(0.55, 1.0)

        # Custom visible plot area.
        # ax.set_xlim(-3, 3)
        # The extra margin prevents elements like the circle marker from being cut off.
        # Without it, rendering stops exactly at the data limits.
        ax.set_ylim(-h*1.1, h*1.1)

        # Axes
        # Axes on center:
        # https://stackoverflow.com/questions/31556446/how-to-draw-axis-in-the-middle-of-the-figure
        ax.spines['left'].set_position('zero')
        ax.spines['right'].set_visible(False)
        ax.spines['bottom'].set_position('zero')
        ax.spines['top'].set_visible(False)
        # Axes with arrow:
        # https://stackoverflow.com/questions/33737736/matplotlib-axis-arrow-tip
        ax.plot(1, 0, ls="", marker=">", ms=10, color="k",
                transform=ax.get_yaxis_transform(), clip_on=False)
        ax.plot(0, 1, ls="", marker="^", ms=10, color="k",
                transform=ax.get_xaxis_transform(), clip_on=False)

        # Ticks
        ax.xaxis.set_ticks_position('bottom')
        ax.yaxis.set_ticks_position('left')
        # Make ticks a bit longer.
        ax.tick_params(width=1, length=10)
        # Select tick positions
        # https://stackoverflow.com/questions/12608788/changing-the-tick-frequency-on-x-or-y-axis-in-matplotlib
        xticks = np.arange(math.ceil(min(x)),     math.floor(max(x)) + 1, 1)
        yticks = np.arange(math.ceil(min(y)) - 1, math.floor(max(y)) + 2, 1)
        # Remove 0.
        xticks = np.setdiff1d(xticks, [0])
        yticks = np.setdiff1d(yticks, [0])
        ax.xaxis.set_ticks(xticks)
        ax.yaxis.set_ticks(yticks)
        # Another approach. But because I want to be able to remove the 0,
        # anyways, I just explicitly give all ticks instead.
        # ax.xaxis.set_major_locator(matplotlib.ticker.MultipleLocator(1.0))
        # ax.yaxis.set_major_locator(matplotlib.ticker.MultipleLocator(1.0))

        # Move certain ticks around.
        # https://stackoverflow.com/questions/64500061/how-to-change-the-position-of-some-x-axis-tick-labels-on-top-of-the-bottom-x-axi
        for g,t in zip(ax.get_xticks(),ax.get_xticklabels()):
            if g<0:
                t.set_va('bottom')
            else:
                t.set_va('top')
            t.set_transform(ax.transData)
            t.set_position((g,0.15*-(g/abs(g))))

        # Annotations.
        ax.plot([0, np.pi/2], [h, h], '--r')
        ax.plot([np.pi/2, np.pi/2], [h, 0], '--r')
        ax.plot(np.pi/2, h, marker='o', linewidth=2, markersize=10,
            markerfacecolor='w', markeredgewidth=1.5, markeredgecolor='black')
