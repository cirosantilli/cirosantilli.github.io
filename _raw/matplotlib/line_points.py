#!/usr/bin/env python
def plot(plt, params):
    fig, axs = plt.subplots(3, 1)
    d = [0, 1, 3, 6]
    axs[0].plot(d, linestyle='-')
    axs[0].set_title('-')
    axs[1].plot(d, linestyle='--')
    axs[1].set_title('--')
    axs[2].plot(d, 'o')
