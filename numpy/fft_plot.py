#!/usr/bin/env python

import math

import matplotlib.pyplot as plt
import numpy as np

N = 25
x = np.array([math.sin(i * 2 * math.pi / N) + math.sin(i * 2 * math.pi * 4 / N) for i in range(N)])
X = np.fft.fft(x)

fig, axs = plt.subplots(3, 1)
fig.suptitle('X = DFT(x)')
fig.tight_layout()

ax = axs[0]
ax.set_title('x(t) = sin(t) + sin(4t)')
ax.plot(np.arange(0., N, 1.), x, '.')
ax.axis([-0.5, N, -2.5, 2.5])
ax.grid()

ax = axs[1]
ax.set_title('Re(X(t))')
ax.plot(np.arange(0., N, 1.), np.real(X), '.')
ax.axis([-0.5, N, -15, 15])
ax.set_yticks([-12.5, 0.0, 12.5], minor=False)
ax.grid()

ax = axs[2]
ax.set_title('Im(X(t))')
ax.plot(np.arange(0., N, 1.), np.imag(X), '.')
ax.axis([-0.5, N, -15, 15])
ax.set_yticks([-12.5, 0.0, 12.5], minor=False)
ax.grid()

plt.savefig(
    'fft.svg',
    format='svg',
    dpi=1000/plt.gcf().get_size_inches()[1],
    bbox_inches='tight',
)
