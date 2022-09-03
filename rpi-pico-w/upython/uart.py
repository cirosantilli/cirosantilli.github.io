import machine
import time

led = machine.Pin('LED', machine.Pin.OUT)
# For Rpi Pico (non-W) it was like this instead apparently.
# led = Pin(25, Pin.OUT)

i = 0
while (True):
    led.toggle()
    print(i)
    time.sleep(.5)
    i += 1
