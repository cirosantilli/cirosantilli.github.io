; Adapted from: http://www.csounds.com/manual/html/MidiTop.html#MidiVirtual
<CsoundSynthesizer>
<CsOptions>; Select audio/midi flags here according to platform
-odac           -iadc    -+rtmidi=virtual -M0
</CsOptions>

<CsInstruments>
sr=44100
ksmps=10
nchnls=1
massign 1,1
prealloc 1,10

instr 1
inote cpsmidi
iveloc ampmidi 10000
aosc oscili 1000,inote,1
aout = aosc
; Use controller 7 to control volume
kvol ctrl7 1, 7, 0.2, 1
outs kvol * aout
endin
</CsInstruments>
<CsScore>
f0 3600
f1 0 1024 10 1
f2 0 16 7 1 8 0 8
f3 0 1024 10 1 .5 .6 .3 .2 .5
e
</CsScore>
</CsoundSynthesizer>
