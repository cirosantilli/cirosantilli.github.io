#!/usr/bin/env python

from math import sqrt

from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer, AerSimulator
from qiskit.quantum_info import Statevector
from qiskit.visualization import plot_histogram

def test_circuit(init, print_qc=False):
    qc = QuantumCircuit(2, 2)
    qc.initialize(init)
    qc.cx(0, 1)
    if print_qc:
        print(qc)
    state = Aer.get_backend('statevector_simulator').run(qc, shots=1).result().get_statevector()
    print(f'init: {init}')
    # print(f'state: {state}')
    probs = state.probabilities()
    print(f'probs: {probs}')
    print()

test_circuit([1, 0, 0, 0], print_qc=True)
test_circuit([0, 1, 0, 0])
test_circuit([0, 0, 1, 0])
test_circuit([0, 0, 0, 1])
test_circuit([1/sqrt(2), 0, 0, 1/sqrt(2)], print_qc=True)
