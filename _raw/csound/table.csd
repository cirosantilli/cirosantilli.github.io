; Adapted from: http://www.csounds.com/toots/index.html
<CsoundSynthesizer>
<CsOptions>
csound -m35 -R -W -f -d -o dac
</CsOptions>
<CsInstruments>
sr = 44100
kr = 4410
ksmps = 10
nchnls = 1

instr 12
  iamp     = ampdb(p4)
  kdirect  = p5
  imeth    = p6
  ilforate = p7
  iseed    = p8

  ; Table index = 2 (f2).
  itab = 2
  itabsize = 8
  if (imeth == 1) igoto direct
  if (imeth == 2) kgoto lfo
  if (imeth == 3) kgoto random
direct:
  kpitch table kdirect, itab
  kgoto  contin
lfo:
  kindex phasor ilforate
  kpitch table kindex, itab, 1
  kgoto contin
random:
  kindex randh int(7), ilforate, iseed
  kpitch table abs(kindex), itab
contin:
  asig oscil iamp, cpspch(kpitch), 1
  out asig
endin

</CsInstruments>
<CsScore>
f1 0 4096 10 1
; cpspch C major scale
f2 0 8    -2 8.00 8.02 8.04 8.05 8.07 8.09 8.11 9.00

i12 0  .25  86 7 1 0 0
i.  +  .    .  6 1 0
i.  +  .    .  5 1 0
i.  +  .    .  4 1 0
i.  +  .    .  3 1 0
i.  +  .    .  2 1 0
i.  +  .    .  1 1 0
i.  +  .    .  0 1 0
i.  +  .    .  0 1 0
i.  +  .    .  2 1 0
i.  +  .    .  4 1 0
i.  +  .    .  7 1 0
f0  1

; method 2 - lfo index of table values
s
i12  0 2 86 0 2  1 0
i.   3 . .  . .  2
i.   6 . .  . .  4
i.   9 . .  . .  8
i.  12 . .  . . 16
f0  16

; method 3 - random index of table values
s
i12 0  2 86 0 3 2   .1
i12 3  2 86 0 3 3   .2
i12 6  2 86 0 3 4   .3
i12 9  2 86 0 3 7   .4
i12 12 2 86 0 3 11  .5
i12 15 2 86 0 3 18  .6
i12 18 2 86 0 3 29  .7
i12 21 2 86 0 3 47  .8
i12 24 2 86 0 3 76  .9
i12 27 2 86 0 3 123 .9
i12 30 5 86 0 3 199 .
e
</CsScore>
</CsoundSynthesizer>
