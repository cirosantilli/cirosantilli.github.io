#!/usr/bin/env bash
set -eu
primes 2 "${1:-1000}" | awk '{ n = $1; pi = NR + 1; a = n/log(n); print n, pi, a, log(n), pi - a, pi/a }' > p.dat
gnuplot main.gnuplot
