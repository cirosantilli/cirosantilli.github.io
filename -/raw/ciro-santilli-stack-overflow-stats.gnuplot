#!/usr/bin/env gnuplot
set datafile separator ","
f = 'ciro-santilli-stack-overflow-stats.csv'
set terminal pngcairo size 800,900
set output "ciro-santilli-stack-overflow-stats.png"

set style line 1 linewidth 2 linecolor rgb "red"
set title font ',15'
set multiplot layout 3,1 title "{/:Bold Ciro Santilli's Stack Overflow stats}" font ",20"
set key autotitle columnhead
unset key
set xrange [2008:]
# https://stackoverflow.com/questions/8015651/gnuplot-multiplot-how-to-keep-the-plot-of-equal-size-after-removing-tics-and-axi/15804690#15804690
set lmargin 6

set yrange [150:0]
set ytics 0,50,150
set title "{/:Bold Ciro Santilli's year rank (top N-th user by reputation gain in year)}"
plot f using 1:2 with linespoints linestyle 1

unset yrange
set ytics 0,100,400
set yrange [0:400]
set title "{/:Bold Ciro Santilli's answers per year}"
plot f using 1:3 with linespoints linestyle 1

unset yrange
set ytics 0,1,4
set yrange [0:4]
set title "{/:Bold Total site questions per year (millions)}"
plot f using 1:($4/1000000) with linespoints linestyle 1
