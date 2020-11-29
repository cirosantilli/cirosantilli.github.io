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
; p3: duration
; p4: amplitude
; p5: frequency
; p6: attack time
; p7: release time
k1 linen p4, p6, p3, p7
a1 oscil k1, p5, 1
out a1
endin

</CsInstruments>
<CsScore>
f1 0 4096 10 1

; With envelope.
i1 0.0 0.5 10000 440 0.125 0.25
i.   +   .     . 660     .    .
i.   +   .     . 880     .    .

; Without envelope for comparison.
; One notable difference is that on note switches
; you can hear a click.
i. 2.0 0.5     . 440 0     0
i.   +   .     . 660 0     0
i.   +   .     . 880 0     0
</CsScore>
</CsoundSynthesizer>
