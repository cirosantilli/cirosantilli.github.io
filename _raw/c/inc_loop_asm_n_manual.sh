#!/usr/bin/env bash
# This is the one I used after manually collating data from various CPUs.
# http://ourbigbook.com/cirosantilli/_file/c/inc_loop_asm_n.sh
gnuplot <<EOF
set term png
set output "inc_loop_asm_n_manual.png"
set title "{/*1.15 Time to run 5B loops of N superscalar parallelizable INC instructions}"
set xlabel "{/*1.25N instructions per loop}"
set ylabel 's'
set xtics 1
set yrange [0:]
plot 'inc_loop_asm_n_manual.txt' using (\$1+1):2 with linespoints title 'AMD 7840U (2023)', \
     'inc_loop_asm_n_manual.txt' using (\$1+1):3 with linespoints title 'Intel i7-7820HQ (2017)'
EOF
