"""
Plot data from file.

- http://matplotlib.org/api/pyplot_api.html#matplotlib.pyplot.plotfile
- http://stackoverflow.com/questions/11248812/matplotlib-basic-plotting-from-text-file
- http://stackoverflow.com/questions/13545388/plot-data-from-csv-file-with-matplotlib
- http://stackoverflow.com/questions/12311767/how-to-plot-files-with-numpy
"""

import numpy as np
import os

def plot(plt, params):
    data = np.loadtxt(os.path.join(os.path.dirname(__file__), 'square.dat')).transpose()
    plt.plot(data[0], data[1])
