#!/usr/bin/env gnuplot
# TODO need to convert IP to number first.
set terminal svg size 1200, 800
set output "hits-hist.svg"
binwidth=16777216
bin(x,width)=width*floor(x/width)
plot '../../media/cia-2010-covert-communication-websites/hits.csv' using (bin($1,binwidth)):(1.0) smooth freq with boxes
