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
iamp = p4
ifreq = p5
ibend_prop = p6
ibend_pre_time = p7
ibend_up_time = p7
ibend_hold_time = p8
ibend_down_time = p9
ibend_post_time = p10

imaxfreq = ifreq*ibend_prop
a2 linseg ifreq, ibend_pre_time,
          ifreq, ibend_up_time,
          imaxfreq, ibend_hold_time,
          imaxfreq, ibend_down_time,
          ifreq, ibend_post_time,
          ifreq
a1 oscil iamp, a2, 1
out a1
endin

</CsInstruments>
<CsScore>
f1 0 4096 10 1
i1 0.0 2.0 2000 440 2.0 0.2 0.2 1.2 0.2 0.2
e
</CsScore>
</CsoundSynthesizer>
