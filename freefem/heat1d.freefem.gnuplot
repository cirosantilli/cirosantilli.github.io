#!/usr/bin/env gnuplot
# Tested on gnuplot 5.2 patchlevel 8.
set terminal gif animate delay 10
set output 'heat1d.freefem.gif'
f = 'heat1d.freefem.dat'
stats f nooutput
set yrange [STATS_min_y:STATS_max_y]
set xlabel 'x'
set ylabel 'temperature'
do for [i=0:int(STATS_blocks)-1] {
  set title sprintf('t = %d', i)
  plot f index i with linespoints notitle
}
