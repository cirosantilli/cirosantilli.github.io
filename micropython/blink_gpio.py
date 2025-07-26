# Blink LED on pin 0. Tested on: RPI Pico W

from machine import Pin
from time import sleep

pin = Pin(0, Pin.OUT)
i = 0
while (True):
    pin.toggle()
    print(i)
    sleep(0.5)
    i += 1
