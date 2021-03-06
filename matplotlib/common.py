#!/usr/bin/env python

"""
Contains stuff that is common to all plots of a project

Takes as input exactly one command line argument which is the path
of a python file with a `plot` which has the same signature as `plot`:func:

The goal of this design is to separte separate plots into different files so that:

- it all works well with makefiles so that only plots corresponding to
modified `.py` files will be replotted on make

- the code is better organized

sample call:

    ./THIS_FILENAME.py subplots
"""

import importlib
import os
import sys

import matplotlib.pyplot as plt

class DefaultParameters:
    """
    Encapsulates all the default plot parameters
    """

def braket(text):
    return '|' + text + '\u27E9'

def plot(plt, params):
    """plot on an empty plt object

    :param plt: a clean ``matplotlib.pyplot`` object
    :type plt:  ``matplotlib.pyplot``
    :param params: default plot params. Function may override those defaults.
    :type params:  the class `DefaultParameters`:class: (not an instance)
    """
    # https://stackoverflow.com/questions/2601047/import-a-python-module-without-the-py-extension/56090741#56090741
    raise NotImplementedError

def import_path(path):
    module_name = os.path.basename(path).replace('-', '_')
    spec = importlib.util.spec_from_loader(
        module_name,
        importlib.machinery.SourceFileLoader(module_name, path)
    )
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    sys.modules[module_name] = module
    return module

if __name__ == '__main__':
    path = sys.argv[1]
    if len(sys.argv) > 2:
        out_ext = sys.argv[2]
    else:
        out_ext = 'svg'
    name = os.path.split(os.path.splitext(path)[0])[1]
    try:
        plotter = import_path(path)
    except IOError:
        print(path)
        print(name)
        raise
    else:
        ret = plotter.plot(plt, DefaultParameters)
        if ret is None:
            ret = {}
        if not 'height' in ret:
            ret['height'] = 400
        if not 'bbox_inches' in ret:
            ret['bbox_inches'] = 'tight'
        # https://stackoverflow.com/questions/64642855/how-to-obtain-a-fixed-height-in-pixels-fixed-data-x-y-aspect-ratio-and-automati
        # plt.tight_layout(pad=1)
        plt.savefig(
            name + '.' + out_ext,
            format=out_ext,
            dpi=ret['height']/plt.gcf().get_size_inches()[1],
            # https://stackoverflow.com/questions/64642855/how-to-obtain-a-fixed-height-in-pixels-fixed-data-x-y-aspect-ratio-and-automati
            bbox_inches='tight',
        )
        plt.clf()
