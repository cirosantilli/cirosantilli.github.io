from machine import ADC, Pin
from time import sleep

led = Pin('LED', Pin.OUT)
adc = ADC(Pin(26))

while True:
    print(adc.read_u16())
    led.toggle()
    sleep(0.2)
