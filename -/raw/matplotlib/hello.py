import numpy as np

def plot(plt, params):
    t = np.arange(-10., 10., 1.)
    plt.plot(t, t, '.')
    plt.plot(t, t**2, '.')
