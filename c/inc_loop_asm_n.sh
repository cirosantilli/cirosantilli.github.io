#!/usr/bin/env bash

set -eu

ninsts_max="${1:-12}"
nloops="${2:-5000000000}"
ninsts=0
f=inc_loop_asm_n.c
b=${f%.*}
exec="${b}.out"
dat="${b}.txt"

rm -f "$dat"
while [ "$ninsts" -le "$ninsts_max" ]; do
printf "$ninsts " >> "$dat"
for inst in inc; do
echo "$ninsts $inst"

# Stuff derived from inst only.
clobbers=
# Limits because we don't have enough registers of a given type.
ninsts_inst_max=12
case "$inst" in
  inc) ;;
  add) ;;
  mul)
    # This works. but anything with clobbers can't be independent
    # from the other instructions... I'm dumb.
    clobbers='"rax", "rbx", "rdx"'
    ninsts_inst_max=9
  ;;
  *) exit 1;;
esac

if [ "$ninsts" -le "$ninsts_inst_max" ]; then
cat <<EOF >"$f"
#include <stdlib.h>
#include <stdint.h>

int main(int argc, char **argv) {
    uint64_t nloops;
EOF
i=0
while [ "$i" -le "$ninsts" ]; do
cat <<EOF >>"$f"
    uint64_t i${i} = 0;
EOF
  i="$((i + 1))"
done
cat <<EOF >>"$f"
    if (argc > 1 ) {
        nloops = strtoll(argv[1], NULL, 0);
    } else {
        nloops = 1;
    }
#if defined(__x86_64__) || defined(__i386__)
    __asm__ (
        "loop:"
EOF

cat <<EOF >>"$f"
        "inc %[i0];"
EOF
i=1
while [ "$i" -le "$ninsts" ]; do
  case "$inst" in
    inc) s="${inst} %[i${i}]";;
    add) s="${inst} \$1, %[i${i}]";;
    mul) s="${inst} %[i${i}]";;
    *) exit 1;;
  esac
  cat <<EOF >>"$f"
        "$s;"
EOF
  i="$((i + 1))"
done

cat <<EOF >>"$f"
        "cmp %[nloops], %[i0];"
        "jb loop;"
EOF

if [ "$ninsts" -eq 0 ]; then
cat <<EOF >>"$f"
        : [i0] "+r" (i0)
EOF
else
cat <<EOF >>"$f"
        : [i0] "+r" (i0),
EOF
fi
i=1
while [ "$i" -lt "$ninsts" ]; do
cat <<EOF >>"$f"
          [i${i}] "+r" (i${i}),
EOF
  i="$((i + 1))"
done
if [ "$ninsts" -gt 0 ]; then
cat <<EOF >>"$f"
          [i${i}] "+r" (i${i})
EOF
fi

# End.
cat <<EOF >>"$f"
        : [nloops] "r" (nloops)
        : ${clobbers}
    );
#endif
    return
EOF

i=0
while [ "$i" -lt "$((ninsts - 1))" ]; do
cat <<EOF >>"$f"
        i${i} +
EOF
  i="$((i + 1))"
done
cat <<EOF >>"$f"
        i${i}
EOF

cat <<EOF >>"$f"
    ;
}
EOF

#nl -ba "$f"
make --silent
printf "$(command time -f '%U' -q ./"$exec" "$nloops" 2>&1) " >> "$dat"
else # [ "$nists" -le "$ninsts_inst_max" ]
# Placeholder for when we can't do that many registers.
printf "0 " >> "$dat"
fi  # [ "$nists" -le "$ninsts_inst_max" ]
done # for inst in
sed -i '$ s/.$//' "$dat"
ninsts="$((ninsts + 1))"
printf "\n" >> "$dat"
done # [ "$ninsts" -le "$ninsts_max" ]

gnuplot <<EOF
set term png
set output "${b}.png"
set title "Time to run 5B loops of N parallelizable instructions on AMD 7840U"
set xlabel "{/*1.25N instructions per loop}\n{/*0.75 *0 means just one inc for loop variable}"
set ylabel 'time (s)'
set xtics 1
set yrange [0:]
plot '$dat' using 1:2 with linespoints title 'inc'
EOF
