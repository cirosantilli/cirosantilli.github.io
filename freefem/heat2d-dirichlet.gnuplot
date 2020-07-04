#!/usr/bin/env gnuplot
# Tested on gnuplot 5.2 patchlevel 8.
set terminal gif animate delay 10
set output 'heat2d-dirichlet.gif'
f = 'heat2d-dirichlet.freefem.dat'
stats f using 3 nooutput
set hidden3d
set xyplane at 0
set zrange [STATS_min:STATS_max]
set xlabel 'x'
set ylabel 'y'
set zlabel 'temperature' offset 1,1,1
set cbrange [STATS_min:STATS_max]
do for [i=0:int(STATS_blocks)-1] {
  set title sprintf('t = %d', i)
  splot f index i with lines palette notitle
}
