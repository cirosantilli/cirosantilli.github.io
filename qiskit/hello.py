#!/usr/bin/env python

from qiskit import QuantumCircuit, transpile
from qiskit_aer import Aer, AerSimulator
from qiskit.quantum_info import Statevector
from qiskit.visualization import plot_histogram

def print_state(qc):
    # Get state vector
    state = Aer.get_backend('statevector_simulator').run(qc, shots=1).result().get_statevector()
    print('state:')
    print(state)
    probs = state.probabilities()
    print('probs:')
    print(probs)

qc = QuantumCircuit(2, 2)
print('input:')
print_state(qc)
print()
qc.h(0)
print('h:')
print_state(qc)
print()
qc.cx(0, 1)
print('cx:')
print_state(qc)
print()
print('qc without measure:')
print(qc)

# Add measures and simulate some runs.
# Can't get state properly with measures.
qc.measure([0, 1], [0, 1])

# Print the circuit in a bunch of ways.
print('qc with measure:')
print(qc)
print('qasm:')
print(qc.qasm())
# Works but slows things down.
#qc.draw('mpl', filename='hello_qc.svg')

# Compile the circuit, and simulat it.
simulator = AerSimulator()
qct = transpile(qc, simulator)
# No changes in this specific case, as the simulator likely supports all gates.
print('qct:')
print(qct)
job = simulator.run(qc, shots=1000)
result = job.result()
counts = result.get_counts(qc)
print(f'{counts=}')
job = simulator.run(qc, shots=1000)
result = job.result()
counts = result.get_counts(qc)
print(f'{counts=}')
#plot_histogram(counts, filename='hello_hist.svg')
