import numpy as np
import matplotlib as mpl

import common

fontsize = 16

def braket(ax, x, y, text):
    ax.text(
        x,
        y,
        common.bracket(text),
        verticalalignment='center',
        horizontalalignment='center',
        fontdict=dict(size=fontsize, weight='bold')
    )

def plot(plt, params):
    color = 'black'
    linewidth = 2
    fig, ax = plt.subplots()
    draw_width = 1.0
    ax.set_aspect(1)
    n = 9
    dx = draw_width/n
    draw_height = 2*dx
    ax.set_xlim(-1.2*dx, draw_width+1.2*dx)
    ax.set_ylim(draw_height * -0.75, draw_height * 1.5)
    line_length = dx*0.8;
    arrow_head_length = 6
    name_map = {
        n//4: ['+', 'i'],
        n//2: ['1', '1'],
        3*(n//4): ['-', '-i'],
    };
    for i in range(n):
        translate_x = draw_width * i/(n-1)
        rotate = np.pi*i/(n - 1)

        def draw_double_arrow(a, b, middleline):
            '''
            This is a mess.
            https://stackoverflow.com/questions/25761717/matplotlib-simple-and-two-head-arrows#comment114130205_64368063
            https://stackoverflow.com/questions/25761717/matplotlib-simple-and-two-head-arrows#comment114130705_55191333
            '''
            for forward in [True, False]:
                if forward:
                    a2 = a
                    b2 = b
                else:
                    a2 = b
                    b2 = a
                arrow = mpl.patches.FancyArrowPatch(
                    a2,
                    b2,
                    color=color,
                    linewidth=0,
                    shrinkA=arrow_head_length,
                    shrinkB=0,
                    arrowstyle=mpl.patches.ArrowStyle.Simple(
                        head_length=arrow_head_length,
                        head_width=15,
                        tail_width=linewidth
                    ),
                )
                t = mpl.transforms.Affine2D().rotate(rotate) + \
                    mpl.transforms.Affine2D().translate(translate_x, draw_height*middleline) + \
                    ax.transData
                arrow.set_transform(t)
                ax.add_artist(arrow)

        # Linear.
        draw_double_arrow((0, -line_length/2), (0,  line_length/2), 0.75)

        # Circular.
        middleline = .25
        if i in [0, n//2, n - 1]:
            draw_double_arrow((0, -line_length/2), (0,  line_length/2), middleline)
        else:
            ellipse_height = np.abs(line_length*np.cos(rotate))
            ellipse = mpl.patches.Ellipse(
                (0, 0),
                np.abs(line_length*np.sin(rotate)),
                ellipse_height,
                fill=False,
                linewidth=linewidth
            )
            t = mpl.transforms.Affine2D().translate(translate_x, draw_height*middleline) + \
                ax.transData
            ellipse.set_transform(t)
            ax.add_artist(ellipse)
            ellipse_top = draw_height*middleline + ellipse_height/2
            marker = ">" if i < n//2 else "<"
            ax.plot(translate_x, ellipse_top, ls="", marker=marker, markersize=8, color="k",
                    clip_on=False)


        # Annotations top and bottom.
        if i in name_map:
            common.braket(ax, translate_x, draw_height* 1.25, name_map[i][0])
            common.braket(ax, translate_x, draw_height*-0.25, name_map[i][1])

    # Annotations outside of loop.
    common.braket(ax, -dx, draw_height*0.5, '0')
    common.braket(ax, draw_width+dx, draw_height*0.5, '0')
    ax.text(
        draw_width/2,
        draw_height*-0.75,
        'Increasing θ',
        verticalalignment='center',
        horizontalalignment='center',
        fontdict=dict(size=fontsize)
    )
    def draw_axis_arrow(height):
        ax.add_artist(mpl.patches.FancyArrowPatch(
            (draw_width*0.0, height),
            (draw_width*1.0, height),
            color='black',
            linewidth=0,
            arrowstyle=mpl.patches.ArrowStyle.Simple(
                head_length=15,
                head_width=15,
                tail_width=linewidth
            ),
        ))
    draw_axis_arrow(draw_height*-0.55)

    debug = False
    if debug:
        ax.grid()
    else:
        ax.set_axis_off()
