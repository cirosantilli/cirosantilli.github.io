from machine import Pin
import time

led = Pin('LED', Pin.OUT)
# For Rpi Pico (non-W) it was like this instead apparently.
# led = Pin(25, Pin.OUT)

while (True):
    led.toggle()
    time.sleep(.5)
