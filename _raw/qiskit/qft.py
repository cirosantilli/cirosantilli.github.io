#!/usr/bin/env python

import math

from qiskit import QuantumCircuit, transpile
from qiskit.circuit.library import QFT
from qiskit_aer import Aer, AerSimulator

n = 3
N = 2**n

def test(init, print_qc=False):
    qc = QuantumCircuit(n)
    qc.initialize(init)
    qft = QFT(num_qubits=n).to_gate()
    qc.append(qft, qargs=range(3))
    print(f'init: {init}')
    if print_qc:
        print('qc')
        print(qc)
    qc = transpile(qc, AerSimulator())
    if print_qc:
        print('transpiled qc')
        print(qc)
    print(Aer.get_backend('statevector_simulator').run(qc, shots=1).result().get_statevector())
    print()

test([1] + [0] * (N - 1), print_qc=True)
test([math.sin(i * 2 * math.pi / N)/2 for i in range(N)])
