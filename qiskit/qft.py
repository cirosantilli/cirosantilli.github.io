#!/usr/bin/env python

from qiskit import QuantumCircuit, transpile
from qiskit.circuit.library import QFT
from qiskit_aer import Aer, AerSimulator

qc = QuantumCircuit(3)
qft = QFT(num_qubits=3).to_gate()
qc.append(qft, qargs=range(3))
print('qc')
print(qc)
qc = transpile(qc, AerSimulator())
print('transpiled qc')
print(qc)
print(Aer.get_backend('statevector_simulator').run(qc, shots=1).result().get_statevector())
