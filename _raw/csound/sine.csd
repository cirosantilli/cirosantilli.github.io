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
; 10000: amplitude
; 440: frequency
a1 oscil 10000, 440, 1
out a1
endin

</CsInstruments>
<CsScore>
f1 0 4096 10 1
; 0: start time in seconds
; 2: duration in seconds
i1 0.0 0.5
i1 1.0 1.0
i1 2.5 0.5
; end
e
</CsScore>
</CsoundSynthesizer>
