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

instr 1
iamp = ampdb(p4)
ifreq = cpspch(p5)
iattack_time = p6
irelease_time = p7
ichorus_freq_delta = p8

iscale = iamp/3
k1 linen iscale, iattack_time, p3, irelease_time
a3 oscil k1, ifreq*(1.0 - ichorus_freq_delta), 1
a2 oscil k1, ifreq*(1.0 + ichorus_freq_delta), 1
a1 oscil k1, ifreq                           , 1
a1 = a1+a2+a3
out a1
endin
</CsInstruments>
<CsScore>
f1 0 4096 10 1
i1 0.0 1.0 80 8.00 0.1 0.2 0.004
i. +   .    . 8.03   .   .     .
i. +   .    . 8.05   .   .     .
i. +   .    . 8.00   .   . 0.000
i. +   .    . 8.03   .   .     .
i. +   .    . 8.05   .   .     .
e
</CsScore>
</CsoundSynthesizer>
