import machine
import time

led = machine.Pin('LED', machine.Pin.OUT)
# For Rpi Pico (non-W) it was like this instead apparently.
# led = Pin(25, Pin.OUT)

while (True):
    led.toggle()
    time.sleep(.5)
