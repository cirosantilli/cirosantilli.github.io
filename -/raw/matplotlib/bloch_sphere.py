import math
import numpy as np
import matplotlib
import mpl_toolkits
from matplotlib.patches import FancyArrowPatch

import common

class Arrow3D(matplotlib.patches.FancyArrowPatch):
    def __init__(self, xs, ys, zs, *args, **kwargs):
        matplotlib.patches.FancyArrowPatch.__init__(self, (0,0), (0,0), *args, **kwargs)
        self._verts3d = xs, ys, zs

    def draw(self, renderer):
        xs3d, ys3d, zs3d = self._verts3d
        xs, ys, zs = mpl_toolkits.mplot3d.proj3d.proj_transform(xs3d, ys3d, zs3d, renderer.M)
        self.set_positions((xs[0],ys[0]),(xs[1],ys[1]))
        matplotlib.patches.FancyArrowPatch.draw(self, renderer)

def draw_arrow_3d(ax, x, y, z):
    """
    https://stackoverflow.com/questions/22867620/putting-arrowheads-on-vectors-in-matplotlibs-3d-plot
    https://stackoverflow.com/questions/11140163/plotting-a-3d-cube-a-sphere-and-a-vector-in-matplotlib
    """
    ax.add_artist(Arrow3D(
        x,
        y,
        z,
        mutation_scale=20,
        lw=1,
        arrowstyle="-|>",
        color="black"
    ))

def plot(plt, params):

    matplotlib.rcParams['font.weight'] = 'bold'
    matplotlib.rcParams['font.size'] = 15
    fig = plt.figure()
    ax = fig.add_subplot(111, projection='3d')
    # Working labels
    ax.azim = 60
    ax.elev = 30
    ax.grid(False)
    ax.set_axis_off()
    fig.subplots_adjust(left=0, right=1, bottom=0, top=1, wspace=0)

    # Params.
    r = 1

    lim = r*1.5

    # Reduce actual "visible limit" to reduce excessive whitespace around figure.
    # https://stackoverflow.com/questions/41225293/remove-white-spaces-in-axes3d-matplotlib
    lim_vis = lim * 0.55
    ax.set_xlim(-lim_vis, lim_vis)
    ax.set_ylim(-lim_vis, lim_vis)
    ax.set_zlim(-lim_vis, lim_vis)

    # Axes.
    draw_arrow_3d(ax, [-lim, lim], [0, 0], [0, 0])
    draw_arrow_3d(ax, [0, 0], [-lim, lim], [0, 0])
    draw_arrow_3d(ax, [0, 0], [0, 0], [-lim, lim])
    ax.text(lim, 0, 0.1*lim, 'x')
    ax.text(0, lim, -0.11*lim, 'y')
    ax.text(-0.05*lim, 0, lim, 'z')

    # Circles.
    # https://stackoverflow.com/questions/56870675/how-to-do-a-3d-circle-in-matplotlib/64843339#64843339
    p = matplotlib.patches.Circle((0, 0), 1, fill=False)
    ax.add_patch(p)
    mpl_toolkits.mplot3d.art3d.pathpatch_2d_to_3d(p, z=0, zdir="x")
    # p = matplotlib.patches.Circle((0, 0), 1, fill=False)
    # ax.add_patch(p)
    # mpl_toolkits.mplot3d.art3d.pathpatch_2d_to_3d(p, z=0, zdir="y")
    p = matplotlib.patches.Circle((0, 0), 1, fill=False, ls='--')
    ax.add_patch(p)
    mpl_toolkits.mplot3d.art3d.pathpatch_2d_to_3d(p, z=0, zdir="z")

    p = matplotlib.patches.Circle((0, 0), 1, fill=False, ls='--')
    ax.add_patch(p)
    mpl_toolkits.mplot3d.art3d.pathpatch_2d_to_3d(p, z=0, zdir="z")

    # Markers.
    def marker(x, y, z):
        # Some of the points appear below the rest of the plot, which is undesired,
        # but maybe there is no way to get it to work:
        # - https://github.com/matplotlib/matplotlib/issues/14148
        # - https://github.com/matplotlib/matplotlib/issues/14175
        # - https://github.com/matplotlib/matplotlib/pull/14508
        # - https://stackoverflow.com/questions/56010933/matplotlib-plot3d-surface-line-scatter-plot-how-to-define-z-order
        # - https://stackoverflow.com/questions/37611023/3d-parametric-curve-in-matplotlib-does-not-respect-zorder-workaround
        # - https://stackoverflow.com/questions/52923540/matplotlib-3d-workaround-for-plot-order
        # - https://stackoverflow.com/questions/23188561/matplotlib-3d-plot-zorder-issue
        ax.scatter(x, y, z, s=100, color='white', edgecolors='black')
    marker(-r,  0,  0)
    marker( r,  0,  0)
    marker( 0,  r,  0)
    marker( 0, -r,  0)
    marker( 0,  0,  r)
    marker( 0,  0, -r)

    # Marker text.
    ha = 'center'
    ax.text(     r,      0, -0.3*r, common.braket( '+'), ha=ha)
    ax.text(-1.1*r, -0.1*r,  0.2*r, common.braket( '-'), ha=ha)
    ax.text(-0.1*r,  1.1*r,  0.3*r, common.braket('-i'), ha=ha)
    ax.text(-0.2*r, -1.5*r,  0.1*r, common.braket( 'i'), ha=ha)
    ax.text(-0.2*r,      0,      r, common.braket( '0'), ha=ha)
    ax.text( 0.2*r,      0, 1.1*-r, common.braket( '1'), ha=ha)

    # Sample vector. with theta and phi.
    if False:
        # It is getting too hard to cram everything in a single image,
        # bail out for now, just point people to https://en.wikipedia.org/wiki/File:Bloch_sphere.svg
        # which shows that pretty well.
        theta = np.pi/4
        phi = np.pi/4
        sin_theta = np.sin(theta)
        x = sin_theta*np.cos(phi)
        y = sin_theta*np.sin(phi)
        z = np.cos(theta)
        draw_arrow_3d(ax, [0, x], [0, y], [0, z])
        ax.plot([x, x], [y, y], [0, z], color='black', ls='--')
        ax.plot([0, x], [0, y], [0, 0], color='black', ls='--')

    # return {'bbox_inches': fig.bbox_inches.from_bounds(1, 1, 8, 6)}
