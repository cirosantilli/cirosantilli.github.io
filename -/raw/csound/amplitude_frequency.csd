; Adapted from: http://www.csounds.com/toots/index.html
<CsoundSynthesizer>
<CsOptions>
csound -m35 -R -W -f -d -o dac
</CsOptions>
<CsInstruments>
sr = 48000
ksmps = 128
nchnls = 2

instr 1
; p4: amplitude
; p5: frequency
a1 oscil p4, p5, 1
out a1
endin

</CsInstruments>
<CsScore>
f1 0 4096 10 1
i1 0.0 0.5  2000 880
i1 0.5 0.5  4000 440
i1 1.0 0.5  8000 220
i1 1.5 0.5 16000 110
i1 2.0 0.5 32000  55
e
</CsScore>
</CsoundSynthesizer>
