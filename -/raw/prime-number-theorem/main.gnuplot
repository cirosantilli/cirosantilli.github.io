set terminal png
set style data lines
set xlabel "n"

set output "pi.png"
plot "p.dat" using 1:1 title "n", \
     "p.dat" using 1:2 title "pi(n)", \
     "p.dat" using 1:3 title "n/log(n)", \
     "p.dat" using 1:4 title "log(n)"; \

set output "pi-minus.png"
plot "p.dat" u 1:5 title "pi(n) - (n/log(n))"

set output "pi-over.png"
plot "p.dat" u 1:6 title "pi(n)/(n/log(n)))"
