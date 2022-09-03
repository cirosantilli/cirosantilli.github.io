import machine
import time

led = machine.Pin('LED', machine.Pin.OUT)
# For Rpi Pico (non-W) it was like this instead apparently.
# led = Pin(25, Pin.OUT)

while (True):
    led.on()
    time.sleep(.5)
    led.off()
    time.sleep(.5)
