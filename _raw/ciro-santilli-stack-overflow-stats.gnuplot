#!/usr/bin/env gnuplot
set datafile separator ","
f = 'ciro-santilli-stack-overflow-stats.csv'
set terminal pngcairo size 800,600
set output "ciro-santilli-stack-overflow-stats.png"

set style line 1 linewidth 2 linecolor rgb "red"
set title font ',15'
set multiplot layout 2,1 title "{/:Bold Ciro Santilli's Stack Overflow stats}" font ",20"
set key autotitle columnhead
unset key

set xrange [2012:]
set yrange [150:0]
set ytics  0,50,150
set title "{/:Bold Year rank (top N-th user by reputation gain)}"
plot f using 1:2 with linespoints linestyle 1

unset yrange
set ytics  0,100,400
set yrange [0:400]
set title "{/:Bold Answers per year}"
plot f using 1:3 with linespoints linestyle 1
