import numpy as np
import matplotlib as mpl

def plot(plt, params):
    fig, ax = plt.subplots()
    l = 1
    ax.set_xlim(0, l)
    ax.set_ylim(0, l)

    # https://matplotlib.org/api/_as_gen/matplotlib.patches.FancyArrow.html
    arrow = mpl.patches.FancyArrow(
        l*0.1,
        l*0.2,
        l*0.0,
        l*0.4,
        length_includes_head=True,
        # These are in data coordinates, which is really bad.
        # There don't scale with data by default.
        # width=0.01,
        # head_width=0.1,
    )
    ax.add_artist(arrow)

    # https://matplotlib.org/api/_as_gen/matplotlib.patches.FancyArrowPatch.html
    arrow = mpl.patches.FancyArrowPatch(
        (l*0.3, l*0.2),
        (l*0.3, l*0.6),
        color='black',
        # Makes head thicker. This scales with data properly.
        # Without it, the head is basically invisible, bad default.
        mutation_scale=20,
        # The only arrow method that has dual arrow?
        # Shorhands expanded at:
        # https://matplotlib.org/api/_as_gen/matplotlib.patches.ArrowStyle.html
        # https://stackoverflow.com/questions/25761717/matplotlib-simple-and-two-head-arrows/64368063#64368063
        arrowstyle='<|-|>',
        shrinkA=0,
        shrinkB=0,
    )
    ax.add_artist(arrow)

    # Identical to FancyArrowPatch.
    ax.annotate(s='',
        xy=(l*0.5, l*0.2),
        xytext=(l*0.5, l*0.6),
        arrowprops=dict(
            arrowstyle='<|-|>',
            color='black',
            mutation_scale=20,
        ),
    )

    ax.grid()
