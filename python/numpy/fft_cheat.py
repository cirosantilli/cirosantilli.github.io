#!/usr/bin/env python
import math
import numpy as np

def printi(X):
    # Round to int otherwise there is a lot of small numerical noise.
    print('real ' + ' '.join(str(int(np.real(x))) for x in X))
    print('imag ' + ' '.join(str(int(np.imag(x))) for x in X))

def analyze(x):
    # FFT
    X = np.fft.fft(x)
    print('fft')
    printi(X)

    # Real FFT
    Xr = np.fft.rfft(x)
    print('rfft')
    printi(Xr)

N = 20

print('sin(t)')
x = np.array([math.sin(i * 2 * math.pi / N) for i in range(N)])
analyze(x)
print()

print('sin(t) + sin(4t)')
x = np.array([math.sin(i * 2 * math.pi / N) + math.sin(i * 2 * math.pi * 4 / N) for i in range(N)])
analyze(x)
print()
