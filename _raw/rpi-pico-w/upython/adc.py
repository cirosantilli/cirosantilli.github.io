from machine import ADC, Pin
import time

led = machine.Pin('LED', machine.Pin.OUT)
adc = ADC(Pin(26))

while True:
    print(adc.read_u16())
    led.toggle()
    time.sleep(0.2)
