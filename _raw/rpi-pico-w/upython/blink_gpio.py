import machine
import time

led = machine.Pin('LED', machine.Pin.OUT)
pin = machine.Pin(0, machine.Pin.OUT)
i = 0
while (True):
    pin.toggle()
    led.toggle()
    print(i)
    time.sleep(.5)
    i += 1
