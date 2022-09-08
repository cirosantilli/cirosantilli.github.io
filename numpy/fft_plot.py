#!/usr/bin/env python

import math

import matplotlib.pyplot as plt
import numpy as np

N = 25
x = np.array([2 * math.sin(i * 2 * math.pi / N) + math.cos(i * 2 * math.pi * 4 / N) for i in range(N)])
X = np.fft.fft(x)

fig, axs = plt.subplots(3, 1)
fig.suptitle('X = DFT(x)')
fig.tight_layout(rect=[0, 0.03, 1, 0.94])

ax = axs[0]
ax.set_title('x(t) = 2 sin(2 $\\pi$ t / 25) + cos(8 $\\pi$ t / 25)')
#ax.set_title('x(t) = 2 sin(t) + sin(4t) = $-25 e^{1 \\times 2\\pi i t/25} -12.5 e^{4 \\times 2\\pi i t/25} + 12.5 e^{21 \\times 2\\pi i t/25} + -25 e^{24 \\times 2\\pi i t/25}$')
ax.plot(np.arange(0., N, 1.), x, '.')
ax.axis([-0.5, N, -3.5, 3.5])
ax.set_yticks([-3, 0, 3], minor=False)
ax.grid()

ax = axs[1]
ax.set_title('Re(X(t))')
ax.plot(np.arange(0., N, 1.), np.real(X), '.')
ax.axis([-0.5, N, -30, 30])
ax.set_yticks([-25.0, -12.5, 0.0, 12.5, 25.0], minor=False)
ax.grid()

ax = axs[2]
ax.set_title('Im(X(t))')
ax.plot(np.arange(0., N, 1.), np.imag(X), '.')
ax.axis([-0.5, N, -30, 30])
ax.set_yticks([-25, -12.5, 0.0, 12.5, 25], minor=False)
ax.grid()

plt.savefig(
    'fft.svg',
    format='svg',
    dpi=1000/plt.gcf().get_size_inches()[1],
    bbox_inches='tight',
)
